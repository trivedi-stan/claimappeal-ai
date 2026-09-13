import { validateAndParseOutput } from "@/lib/ai/output-validator";

describe("validateAndParseOutput", () => {
  const validOutput = {
    letter: {
      recipient: "Appeals Coordinator, Blue Cross",
      subject: "Formal Appeal for Claim #CLM-12345",
      body: "I am writing to formally appeal the denial of coverage for the procedure performed on January 15, 2026. This treatment was medically necessary and prescribed by Dr. Smith after extensive examination.",
    },
    appeal_strategy: "Focus on documented clinical evidence and ERISA appeal rights.",
    key_arguments: ["Treatment meets clinical criteria", "Prior conservative therapy was completed"],
    supporting_information_needed: ["Letter of Medical Necessity from Dr. Smith", "Physical therapy notes"],
    warnings: ["Must submit within 180 days of denial notice"],
    references: ["ERISA Claim Procedure Regulations 29 CFR 2560.503-1"],
  };

  it("successfully parses valid AI output", () => {
    const result = validateAndParseOutput(validOutput);

    expect(result.letter.recipient).toBe("Appeals Coordinator, Blue Cross");
    expect(result.letter.subject).toBe("Formal Appeal for Claim #CLM-12345");
    expect(result.key_arguments).toHaveLength(2);
    expect(result.references).toHaveLength(1);
  });

  it("sanitizes date placeholders, strips bracketed reference tags, and removes disclaimers from the letter body", () => {
    const outputWithPlaceholders = {
      ...validOutput,
      letter: {
        ...validOutput.letter,
        body: "[DATE]\n\nPer [REF-1], [DOC-2], and [INSERT HERE], this is an appeal.\n\n---\n*This letter is an AI-generated draft. Review all information carefully and consult appropriate professionals before submitting.*",
      },
    };
    const result = validateAndParseOutput(outputWithPlaceholders);

    expect(result.letter.body).not.toContain("[DATE]");
    expect(result.letter.body).not.toContain("[REF-1]");
    expect(result.letter.body).not.toContain("[DOC-2]");
    expect(result.letter.body).not.toContain("[INSERT HERE]");
    expect(result.letter.body).not.toContain("AI-generated draft");
  });

  it("softens overconfident claims to safe, conditional language", () => {
    const outputWithOverconfidentPhrases = {
      ...validOutput,
      letter: {
        ...validOutput.letter,
        body: "I am entitled to a full and fair review under ERISA. A lumbar MRI is the standard-of-care next step. The documented clinical signs meet thresholds for advanced diagnostic evaluation. Provide the credentials of the reviewer who determined this denial.",
      },
    };
    const result = validateAndParseOutput(outputWithOverconfidentPhrases);

    // Overconfident claims should be softened
    expect(result.letter.body).not.toContain("I am entitled to a full and fair review under ERISA");
    expect(result.letter.body).toContain("consistent with applicable plan terms and, to the extent applicable, ERISA");

    expect(result.letter.body).not.toContain("is the standard-of-care next step");
    expect(result.letter.body).toContain("was determined by the treating physician to be clinically appropriate");

    expect(result.letter.body).not.toContain("meet thresholds for");
    expect(result.letter.body).toContain("provides clinical support for");

    expect(result.letter.body).not.toContain("credentials of the reviewer");
    expect(result.letter.body).toContain("qualifications and clinical specialty of the reviewer, to the extent required by law or plan terms");
  });

  it("strips references not present in the allowed references list", () => {
    const outputWithInventedRef = {
      ...validOutput,
      references: [
        "ERISA Claim Procedure Regulations 29 CFR 2560.503-1",
        "Invented Supreme Court Precedent 2024",
      ],
    };

    const allowed = ["ERISA Claim Procedure Regulations"];
    const result = validateAndParseOutput(outputWithInventedRef, allowed);

    expect(result.references).toHaveLength(1);
    expect(result.references[0]).toContain("ERISA");
  });

  it("throws descriptive error when required fields are missing", () => {
    const invalidOutput = {
      letter: {
        recipient: "Appeals Coordinator",
        // missing subject and body
      },
    };

    expect(() => validateAndParseOutput(invalidOutput)).toThrow(/AI output validation failed/);
  });
});
