import { createClient } from "@/lib/supabase/server";
import { getGenerationLimit } from "@/config/plans";
import type { UsageStatus } from "@/types";

/**
 * Usage service — tracks generation counts per billing period.
 * Failed generations do NOT consume quota (PRD §23).
 */
export class UsageService {
  /**
   * Check if user has remaining quota for this billing period.
   */
  static async checkQuota(profileId: string): Promise<boolean> {
    const status = await this.getUsageStatus(profileId);
    return status.remaining > 0;
  }

  /**
   * Get full usage status for display.
   */
  static async getUsageStatus(profileId: string): Promise<UsageStatus> {
    const supabase = await createClient();

    // Get user's current plan
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan, current_period_start, current_period_end")
      .eq("profile_id", profileId)
      .eq("status", "active")
      .single();

    const plan = subscription?.plan ?? "free";
    const limit = getGenerationLimit(plan);

    // Get current period usage
    const now = new Date();
    const periodStart =
      subscription?.current_period_start ??
      new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const periodEnd =
      subscription?.current_period_end ??
      new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

    const { data: usage } = await supabase
      .from("usage_records")
      .select("generation_count")
      .eq("profile_id", profileId)
      .gte("period_start", periodStart)
      .lte("period_end", periodEnd)
      .single();

    const used = usage?.generation_count ?? 0;

    return {
      used,
      limit,
      remaining: Math.max(0, limit - used),
      plan,
      periodStart,
      periodEnd,
    };
  }

  /**
   * Increment usage count after a successful generation.
   */
  static async incrementUsage(profileId: string): Promise<void> {
    const supabase = await createClient();
    const now = new Date();
    const periodStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();
    const periodEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    ).toISOString();

    // Upsert: create or increment
    const { data: existing } = await supabase
      .from("usage_records")
      .select("id, generation_count")
      .eq("profile_id", profileId)
      .gte("period_start", periodStart)
      .lte("period_end", periodEnd)
      .single();

    if (existing) {
      await supabase
        .from("usage_records")
        .update({
          generation_count: existing.generation_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("usage_records").insert({
        profile_id: profileId,
        period_start: periodStart,
        period_end: periodEnd,
        generation_count: 1,
      });
    }
  }
}
