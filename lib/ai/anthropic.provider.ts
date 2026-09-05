import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider } from "./provider";
import type { NormalizedAppealInput, StructuredAppealOutput } from "@/types";
import { buildPrompt } from "./prompt-builder";
import { validateAndParseOutput } from "./output-validator";

const MODEL = process.env.AI_MODEL ?? "claude-sonnet-4-6";

/**
 * Anthropic implementation of the AIProvider interface.
 * Uses structured output via tool_use to guarantee JSON shape.
 */
export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic";
  readonly model = MODEL;

  private client: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateAppeal(
    input: NormalizedAppealInput
  ): Promise<StructuredAppealOutput> {
    const { systemPrompt, userPrompt } = buildPrompt(input);

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      tools: [
        {
          name: "generate_appeal_letter",
          description:
            "Generate a structured insurance appeal letter with strategy and key arguments",
          input_schema: {
            type: "object" as const,
            properties: {
              letter: {
                type: "object",
                properties: {
                  recipient: {
                    type: "string",
                    description:
                      "The name/title of the recipient (e.g., 'Appeals Department')",
                  },
                  subject: {
                    type: "string",
                    description: "Subject line of the appeal letter",
                  },
                  body: {
                    type: "string",
                    description:
                      "Full body text of the appeal letter, professionally written",
                  },
                },
                required: ["recipient", "subject", "body"],
              },
              appeal_strategy: {
                type: "string",
                description:
                  "Brief explanation of the overall appeal strategy used",
              },
              key_arguments: {
                type: "array",
                items: { type: "string" },
                description: "List of key arguments made in the appeal",
              },
              supporting_information_needed: {
                type: "array",
                items: { type: "string" },
                description:
                  "List of additional documents or information the patient should gather",
              },
              warnings: {
                type: "array",
                items: { type: "string" },
                description:
                  "Important warnings or cautions for the patient (e.g., deadlines, missing info)",
              },
              references: {
                type: "array",
                items: { type: "string" },
                description:
                  "ONLY references from the provided reference documents. Do not invent references.",
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
          },
        },
      ],
      tool_choice: { type: "tool", name: "generate_appeal_letter" },
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Extract tool use result
    const toolUseBlock = response.content.find(
      (block) => block.type === "tool_use"
    );
    if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
      throw new Error("AI provider did not return a tool use response");
    }

    const rawOutput = toolUseBlock.input;
    return validateAndParseOutput(rawOutput);
  }
}
