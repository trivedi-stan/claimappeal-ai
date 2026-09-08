import type { AIProvider } from "./provider";
import type { NormalizedAppealInput, StructuredAppealOutput } from "@/types";
import { buildPrompt } from "./prompt-builder";
import { validateAndParseOutput } from "./output-validator";

const DEFAULT_MODEL =
  process.env.AI_MODEL && process.env.AI_MODEL !== "gemini-2.5-flash"
    ? process.env.AI_MODEL
    : "openrouter/free";

/**
 * OpenRouter implementation of the AIProvider interface.
 * Connects to OpenRouter's OpenAI-compatible API endpoint.
 * Supports completely free models (e.g. google/gemini-2.0-flash-exp:free, meta-llama/llama-3.3-70b-instruct:free).
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
          model: this.model,
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
          response_format: { type: "json_object" },
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
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenRouter returned an empty response.");
    }

    // Clean any backtick artifacts if present
    const cleanedJson = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const rawOutput = JSON.parse(cleanedJson);
    return validateAndParseOutput(rawOutput);
  }
}
