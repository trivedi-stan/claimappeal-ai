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

  it("automatically appends mandatory AI disclaimer if absent", () => {
    const result = validateAndParseOutput(validOutput);

    expect(result.letter.body).toContain("AI-generated draft");
    expect(result.letter.body).toContain("Review all information carefully");
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
