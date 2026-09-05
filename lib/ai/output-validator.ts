import { z } from "zod";
import type { StructuredAppealOutput } from "@/types";

/**
 * Zod schema for validating structured AI output.
 * If the AI output doesn't match this shape, the generation fails safely.
 */
const StructuredAppealOutputSchema = z.object({
  letter: z.object({
    recipient: z.string().min(1).max(500),
    subject: z.string().min(1).max(500),
    body: z.string().min(50).max(20000),
  }),
  appeal_strategy: z.string().min(1).max(2000),
  key_arguments: z.array(z.string().max(1000)).max(20),
  supporting_information_needed: z.array(z.string().max(1000)).max(20),
  warnings: z.array(z.string().max(1000)).max(20),
  references: z.array(z.string().max(500)).max(50),
});

/**
 * Validates and parses raw AI output into a typed StructuredAppealOutput.
 * Strips any references not in the allowed list (if provided).
 * Throws a descriptive error if validation fails.
 */
export function validateAndParseOutput(
  raw: unknown,
  allowedReferences?: string[]
): StructuredAppealOutput {
  const result = StructuredAppealOutputSchema.safeParse(raw);

  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    throw new Error(`AI output validation failed: ${errors}`);
  }

  const output = result.data;

  // Safety check: if allowed references provided, strip anything not in the list
  if (allowedReferences && allowedReferences.length > 0) {
    output.references = output.references.filter((ref) =>
      allowedReferences.some(
        (allowed) =>
          ref.toLowerCase().includes(allowed.toLowerCase()) ||
          allowed.toLowerCase().includes(ref.toLowerCase())
      )
    );
  }

  // Safety check: ensure body contains the mandatory disclaimer
  const disclaimerMarker = "AI-generated draft";
  if (!output.letter.body.includes(disclaimerMarker)) {
    output.letter.body +=
      "\n\n---\n*This letter is an AI-generated draft. Review all information carefully and consult appropriate professionals before submitting.*";
  }

  return output as StructuredAppealOutput;
}
