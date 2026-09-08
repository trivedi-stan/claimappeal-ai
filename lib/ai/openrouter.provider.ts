import type { AIProvider } from "./provider";
import type { NormalizedAppealInput, StructuredAppealOutput } from "@/types";
import { buildPrompt } from "./prompt-builder";
import { validateAndParseOutput } from "./output-validator";

const DEFAULT_MODEL =
  process.env.AI_MODEL &&
  process.env.AI_MODEL !== "gemini-2.5-flash" &&
  process.env.AI_MODEL !== "openrouter/free"
    ? process.env.AI_MODEL
    : "inclusionai/ling-3.0-flash-sante:free";

/**
 * OpenRouter implementation of the AIProvider interface.
 * Connects to OpenRouter's OpenAI-compatible API endpoint.
 * Optimized for high-speed, reliable, free healthcare appeal generation.
 */
export class OpenRouterProvider implements AIProvider {
  readonly name = "openrouter";
  readonly model = DEFAULT_MODEL;

  private apiKey: string;

  constructor() {
    const key =
      process.env.OPENROUTER_API_KEY ||
      process.env.AI_API_KEY ||
      process.env.OPENROUTER_KEY;

    if (!key) {
      throw new Error(
        "OPENROUTER_API_KEY is not set. Please add OPENROUTER_API_KEY to your environment variables."
      );
    }
    this.apiKey = key.trim();
  }

  async generateAppeal(
    input: NormalizedAppealInput
  ): Promise<StructuredAppealOutput> {
    const { systemPrompt, userPrompt } = buildPrompt(input);

    const fullSystemInstruction = `${systemPrompt}

CRITICAL REQUIREMENT:
You MUST respond with a single, strictly valid JSON object matching this exact schema:
{
  "letter": {
    "recipient": "Recipient department and carrier name",
    "subject": "Formal appeal subject line with claim ID",
    "body": "Full body text of the appeal letter"
  },
  "appeal_strategy": "Clinical and legal strategy explanation",
  "key_arguments": ["Argument 1", "Argument 2"],
  "supporting_information_needed": ["Exhibit 1", "Exhibit 2"],
  "warnings": ["Warning 1", "Warning 2"],
  "references": ["Ref 1"]
}
Do NOT include markdown formatting like \`\`\`json or explanation before/after. Return raw valid JSON only.`;

    // Candidate models ordered by healthcare capability, speed, and availability
    // OpenRouter limits the models fallback array to a maximum of 3 items
    const candidateModels = Array.from(
      new Set(
        [
          this.model,
          "inclusionai/ling-3.0-flash-sante:free",
          "inclusionai/ling-3.0-flash-fin:free",
          "nvidia/nemotron-3.5-lightning:free",
        ].filter(Boolean)
      )
    ).slice(0, 3);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://claimappeal.ai",
          "X-Title": "ClaimAppeal AI",
        },
        body: JSON.stringify({
          models: candidateModels,
          messages: [
            {
              role: "system",
              content: fullSystemInstruction,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          temperature: 0.2,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: { error?: { message?: string } } | null = null;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // use raw text
      }
      throw new Error(
        `OpenRouter API error (${response.status}): ${
          errorJson?.error?.message || errorText
        }`
      );
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const content =
      choice?.message?.content ||
      choice?.message?.reasoning ||
      choice?.text;

    if (!content || !content.trim()) {
      throw new Error(
        `OpenRouter model (${data.model || "free-tier"}) returned an empty response. Please retry.`
      );
    }

    // Extract JSON block even if surrounded by thoughts, reasoning, or markdown fences
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[OpenRouter] Non-JSON content received:", content);
      throw new Error(
        "OpenRouter response did not contain a valid JSON object. Please retry."
      );
    }

    const rawJsonText = jsonMatch[0];
    let rawOutput: unknown;

    try {
      rawOutput = JSON.parse(rawJsonText);
    } catch {
      // Fallback repair for trailing commas or raw unescaped newlines in string properties
      try {
        const repaired = rawJsonText.replace(/,\s*([\}\]])/g, "$1");
        rawOutput = JSON.parse(repaired);
      } catch {
        console.error("[OpenRouter] Failed to parse JSON:", rawJsonText);
        throw new Error("OpenRouter generated invalid JSON. Please retry.");
      }
    }

    return validateAndParseOutput(rawOutput);
  }
}
