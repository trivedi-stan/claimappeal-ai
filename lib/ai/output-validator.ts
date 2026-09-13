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
  // Metadata fields: optional with safe defaults.
  // Gemini's responseSchema mode sometimes omits these even when prompted —
  // the letter body is the core deliverable; these are supplementary UI data.
  appeal_strategy: z.string().max(2000).optional().default(""),
  key_arguments: z.array(z.string().max(1000)).max(20).optional().default([]),
  supporting_information_needed: z.array(z.string().max(1000)).max(20).optional().default([]),
  warnings: z.array(z.string().max(1000)).max(20).optional().default([]),
  references: z.array(z.string().max(500)).max(50).optional().default([]),
});

/**
 * Validates and parses raw AI output into a typed StructuredAppealOutput.
 * Performs a comprehensive pre-send trust and safety pass:
 * 1. Blocks/replaces unresolved placeholders ([DATE], [REF-x], [X], [DOC-x])
 * 2. Softens overconfident independent medical or legal claims
 * 3. Strips AI disclaimers from deliverable letter body
 * 4. Filters unverified references
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

  // 1. Sanitize date placeholders with current date if present
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  output.letter.body = output.letter.body.replace(/\[DATE\]/gi, formattedDate);

  // 2. Pre-send placeholder block/scrub: eliminate unresolved placeholders
  output.letter.body = output.letter.body
    .replace(/\[REF[-\s]?\d+\]/gi, "")
    .replace(/\[DOC[-\s]?\d+\]/gi, "")
    .replace(/\[INSERT[^\]]*?\]/gi, "")
    .replace(/\[X+\]/gi, "")
    .replace(/\[UNRESOLVED[^\]]*?\]/gi, "")
    .replace(/\[PLACEHOLDER[^\]]*?\]/gi, "")
    .replace(/\s{2,}/g, " ");

  // 3. Soften overconfident claims (Clinical & Legal Safety Net)
  // A. Medical standards: Anchor to treating physician
  output.letter.body = output.letter.body
    .replace(
      /\bis the standard-of-care next step\b/gi,
      "was determined by the treating physician to be clinically appropriate"
    )
    .replace(
      /\bis standard-of-care\b/gi,
      "was determined by the treating physician to be clinically appropriate"
    )
    .replace(
      /\bmeets? thresholds for\b/gi,
      "provides clinical support for"
    );

  // B. ERISA / Legal rights: Make conditional
  output.letter.body = output.letter.body
    .replace(
      /\bI am entitled to a full and fair review under ERISA\b/gi,
      "I request a full and fair review consistent with applicable plan terms and, to the extent applicable, ERISA claims-procedure requirements"
    )
    .replace(
      /\bI am entitled to a full and fair review\b/gi,
      "I request a full and fair review consistent with applicable plan terms and claims-procedure requirements"
    );

  // C. Reviewer credentials: Tone moderation
  output.letter.body = output.letter.body.replace(
    /\bcredentials of the reviewer who (determined|made|issued)\b/gi,
    "qualifications and clinical specialty of the reviewer, to the extent required by law or plan terms, who $1"
  );

  // 4. Safety filter: ensure AI draft disclaimers do NOT contaminate the letter body intended for the insurer
  output.letter.body = output.letter.body
    .replace(/\n*---\n*\*?This letter is an AI-generated draft[\s\S]*?\*?$/i, "")
    .replace(/This letter is an AI-generated draft[\s\S]*?submitting\./gi, "")
    .trim();

  // 5. If allowed references provided, strip anything not in the list
  if (allowedReferences && allowedReferences.length > 0) {
    output.references = output.references.filter((ref) =>
      allowedReferences.some(
        (allowed) =>
          ref.toLowerCase().includes(allowed.toLowerCase()) ||
          allowed.toLowerCase().includes(ref.toLowerCase())
      )
    );
  }

  // 6. Scrub any unverified [REF-X] from key_arguments or warnings
  output.key_arguments = output.key_arguments.map((arg) =>
    arg.replace(/\[REF[-\s]?\d+\]/gi, "").trim()
  );
  output.warnings = output.warnings.map((w) =>
    w.replace(/\[REF[-\s]?\d+\]/gi, "").trim()
  );

  // 7. Source-data fidelity: strip unsourced "documentation available upon request" promises.
  // When the model adds offers to supply supporting materials that were never mentioned in the
  // source data, it creates a credibility risk — the insurer can call the bluff and damage the
  // appeal if that documentation doesn't exist. We auto-scrub these patterns as a safety net.
  const unsourcedOfferPatterns: [RegExp, string][] = [
    [
      /[;,]?\s*supporting disability documentation is available upon request\.?/gi,
      "",
    ],
    [
      /[;,]?\s*disability documentation is available upon request\.?/gi,
      "",
    ],
    [
      /[;,]?\s*additional (disability|functional capacity|functional|supporting) (documentation|records?) (is|are|will be) available upon request\.?/gi,
      "",
    ],
    [
      /[;,]?\s*(this|such|relevant) documentation (will be|can be|is) (provided|furnished|supplied) upon request\.?/gi,
      "",
    ],
  ];
  for (const [pattern, replacement] of unsourcedOfferPatterns) {
    output.letter.body = output.letter.body.replace(pattern, replacement);
  }
  // Clean up any double-spaces or hanging punctuation left by the replacements
  output.letter.body = output.letter.body
    .replace(/ {2,}/g, " ")
    .replace(/\. \./g, ".")
    .trim();

  return output as StructuredAppealOutput;
}
