import { GoogleGenAI } from "@google/genai";
import type { AIProvider } from "./provider";
import type { NormalizedAppealInput, StructuredAppealOutput } from "@/types";
import { buildPrompt } from "./prompt-builder";
import { validateAndParseOutput } from "./output-validator";

const DEFAULT_MODEL = process.env.AI_MODEL ?? "gemini-2.5-flash";

const APPEAL_JSON_SCHEMA = {
  type: "object" as const,
  properties: {
    letter: {
      type: "object" as const,
      properties: {
        recipient: {
          type: "string" as const,
          description: "Recipient name and department (e.g. Appeals & Grievances Department, Carrier Name)",
        },
        subject: {
          type: "string" as const,
          description: "Formal legal subject line with claim number and denial rebuttal",
        },
        body: {
          type: "string" as const,
          description: "Full body text of the formal appeal letter, including date placeholder [DATE], facts, clinical necessity, and closing",
        },
      },
      required: ["recipient", "subject", "body"],
    },
    appeal_strategy: {
      type: "string" as const,
      description: "Brief summary of the clinical and legal strategy used against the denial",
    },
    key_arguments: {
      type: "array" as const,
      items: { type: "string" as const },
      description: "List of key arguments refuting the carrier's adverse determination",
    },
    supporting_information_needed: {
      type: "array" as const,
      items: { type: "string" as const },
      description: "Exhibits, physician notes, or diagnostic scans the member must attach",
    },
    warnings: {
      type: "array" as const,
      items: { type: "string" as const },
      description: "Statutory deadlines (e.g. 180-day ERISA limit) or critical warnings",
    },
    references: {
      type: "array" as const,
      items: { type: "string" as const },
      description: "Only cite references from provided trusted documents. Do not hallucinate.",
    },
  },
  required: [
    "letter",
    "appeal_strategy",
    "key_arguments",
    "supporting_information_needed",
    "warnings",
    "references",
  ],
};

/**
 * Google Gemini implementation of the AIProvider interface.
 * Uses structured JSON output to guarantee schema compliance.
 */
export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  readonly model = DEFAULT_MODEL;

  private apiKey: string;
  private client: GoogleGenAI;

  constructor() {
    const key =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY;

    if (!key) {
      throw new Error(
        "GEMINI_API_KEY is not set. Please add GEMINI_API_KEY to your environment variables."
      );
    }
    this.apiKey = key.trim();
    this.client = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async generateAppeal(
    input: NormalizedAppealInput
  ): Promise<StructuredAppealOutput> {
    const { systemPrompt, userPrompt } = buildPrompt(input);

    try {
      // First attempt: Primary SDK with structured schema
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: APPEAL_JSON_SCHEMA,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Gemini returned an empty response.");
      }

      const rawOutput = JSON.parse(responseText);
      return validateAndParseOutput(rawOutput);
    } catch (primaryErr: unknown) {
      // Fallback: direct HTTP request with Bearer authorization if SDK transport encounters auth header mismatch
      try {
        const fallbackRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: userPrompt }] }],
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: APPEAL_JSON_SCHEMA,
              },
            }),
          }
        );

        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          const candidateText =
            data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const rawOutput = JSON.parse(candidateText);
            return validateAndParseOutput(rawOutput);
          }
        }
      } catch {
        // Ignore fallback fetch error and rethrow detailed primary error
      }

      const msg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      if (msg.includes("API_KEY_SERVICE_BLOCKED") || msg.includes("UNAUTHENTICATED")) {
        throw new Error(
          `Gemini API authentication failed (${msg}). Please verify that the 'Generative Language API' is enabled on your Google Cloud project (https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com) and that your API key does not have restricting IP or service filters.`
        );
      }

      throw primaryErr;
    }
  }
}
