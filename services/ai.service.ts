import { createClient } from "@/lib/supabase/server";
import { getAIProvider } from "@/lib/ai/provider";
import { normalizeAppealInput } from "@/lib/ai/normalizer";
import { scanObjectForInjection } from "@/lib/security/input-sanitizer";
import { AppealService } from "./appeal.service";
import { UsageService } from "./usage.service";
import { ReferenceService } from "./reference.service";
import type { StructuredAppealOutput } from "@/types";

/**
 * AI Service — orchestrates the full generation pipeline.
 * This is the core product IP.
 *
 * Pipeline:
 * 1. Authenticate → 2. Validate → 3. Verify ownership →
 * 4. Check quota → 5. Normalize → 6. Load references →
 * 7. Build prompt → 8. Call AI → 9. Validate output →
 * 10. Safety check → 11. Store version → 12. Increment usage →
 * 13. Return result
 */
export class AIService {
  static async generateAppeal(
    profileId: string,
    appealId: string
  ): Promise<{
    output: StructuredAppealOutput;
    versionNumber: number;
    durationMs: number;
  }> {
    const startTime = Date.now();
    let success = false;
    let errorCode: string | null = null;
    let provider: Awaited<ReturnType<typeof getAIProvider>> | null = null;

    try {
      // 1–3. Auth + ownership verified at API route level

      // 4. Check usage quota
      const canGenerate = await UsageService.checkQuota(profileId);
      if (!canGenerate) {
        throw new Error("QUOTA_EXCEEDED");
      }

      // 5. Get appeal with all related data
      const appeal = await AppealService.getById(appealId);
      if (!appeal) throw new Error("APPEAL_NOT_FOUND");
      if (appeal.profile_id !== profileId) throw new Error("UNAUTHORIZED");

      // 6. Load reference documents
      const references = await ReferenceService.getActiveReferences();

      // 7. Get user profile for patient name
      const supabase = await createClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", profileId)
        .single();

      // Normalize input
      const normalizedInput = normalizeAppealInput(
        appeal,
        profile?.full_name ?? "Patient",
        ((appeal as unknown as Record<string, unknown>).supporting_info as Record<string, unknown>) ?? {},
        references.map((r) => ({ title: r.title, content: r.content }))
      );

      // Security: detect prompt injection attempts before calling LLM
      const injectionCheck = scanObjectForInjection(
        normalizedInput as unknown as Record<string, unknown>
      );
      if (injectionCheck.hasInjection) {
        throw new Error(`PROMPT_INJECTION_DETECTED`);
      }

      // 8. Call AI provider
      provider = await getAIProvider();
      const output = await provider.generateAppeal(normalizedInput);

      // 9–10. Output validated + safety checked inside provider + validator

      // 11. Store new version
      const versionNumber = await storeVersion(appealId, output);

      // 12. Increment usage
      await UsageService.incrementUsage(profileId);

      // Update appeal status
      await AppealService.update(appealId, { status: "generated" });

      success = true;
      const durationMs = Date.now() - startTime;

      // Log generation for analytics
      await logGeneration(
        appealId,
        versionNumber,
        provider.name,
        provider.model,
        durationMs,
        true,
        null
      );

      return { output, versionNumber, durationMs };
    } catch (err) {
      errorCode =
        err instanceof Error ? err.message : "UNKNOWN_ERROR";
      const durationMs = Date.now() - startTime;

      // Log failed generation
      await logGeneration(
        appealId,
        0,
        provider?.name ?? "unknown",
        provider?.model ?? "unknown",
        durationMs,
        false,
        errorCode
      ).catch(() => {}); // Don't throw on logging failure

      throw err;
    }
  }
}

async function storeVersion(
  appealId: string,
  output: StructuredAppealOutput
): Promise<number> {
  const supabase = await createClient();

  // Get current max version number
  const { data: existing } = await supabase
    .from("appeal_versions")
    .select("version_number")
    .eq("appeal_id", appealId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = (existing?.[0]?.version_number ?? 0) + 1;

  const { error } = await supabase.from("appeal_versions").insert({
    appeal_id: appealId,
    version_number: nextVersion,
    structured_output: output,
  });

  if (error) throw new Error(`Failed to store version: ${error.message}`);
  return nextVersion;
}

async function logGeneration(
  appealId: string,
  versionNumber: number,
  providerName: string,
  model: string,
  durationMs: number,
  success: boolean,
  errorCode: string | null
) {
  const supabase = await createClient();

  // Only log with appeal_version_id if version was created
  if (versionNumber > 0) {
    const { data: version } = await supabase
      .from("appeal_versions")
      .select("id")
      .eq("appeal_id", appealId)
      .eq("version_number", versionNumber)
      .single();

    await supabase.from("ai_generations").insert({
      appeal_version_id: version?.id ?? null,
      provider: providerName,
      model,
      duration_ms: durationMs,
      success,
      error_code: errorCode,
      estimated_cost_usd: estimateCost(model, durationMs),
    });
  } else {
    // Failed generation — log without version reference
    await supabase.from("ai_generations").insert({
      appeal_version_id: null,
      provider: providerName,
      model,
      duration_ms: durationMs,
      success,
      error_code: errorCode,
      estimated_cost_usd: 0,
    });
  }
}

function estimateCost(model: string, _durationMs: number): number {
  // Rough cost estimate based on model
  // Claude Sonnet: ~$3/M input, $15/M output tokens
  // Approximate ~2000 input tokens + ~2000 output tokens per generation
  if (model.includes("sonnet")) {
    return 0.036; // ~$0.036 per generation
  }
  return 0.05; // Default conservative estimate
}
