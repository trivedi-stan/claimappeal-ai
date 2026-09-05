import { buildPrompt } from "@/lib/ai/prompt-builder";
import type { NormalizedAppealInput } from "@/types";

describe("buildPrompt", () => {
  const baseInput: NormalizedAppealInput = {
    patientName: "Alex Smith",
    insuranceCompany: "Aetna",
    planType: "HMO",
    memberId: "AET12345",
    groupNumber: "GRP99",
    claimNumber: "CLM-001",
    dateOfService: "2026-01-10",
    providerName: "General Hospital",
    cptCodes: ["99214"],
    diagnosisCodes: ["J06.9"],
    amountBilled: 500,
    amountDenied: 450,
    denialReason: "Out of Network",
    denialCode: "CO-16",
    denialDescription: "Service not covered for non-participating provider.",
    denialDate: "2026-02-05",
    medicalNecessityExplanation: "Emergency condition required nearest facility.",
    additionalNotes: null,
    priorAppealAttempts: false,
    priorAppealDetails: null,
    referenceDocuments: [
      {
        title: "No Surprises Act Emergency Protections",
        content: "Under the No Surprises Act, emergency services must be covered at in-network rates.",
      },
    ],
  };

  it("injects mandatory safety rules in system prompt", () => {
    const { systemPrompt } = buildPrompt(baseInput);

    expect(systemPrompt).toContain("NEVER fabricate medical facts");
    expect(systemPrompt).toContain("Information not provided");
    expect(systemPrompt).toContain("TRUSTED REFERENCE DOCUMENTS");
    expect(systemPrompt).toContain("Do not give legal or medical advice");
  });

  it("includes all normalized fields in user prompt", () => {
    const { userPrompt } = buildPrompt(baseInput);

    expect(userPrompt).toContain("Alex Smith");
    expect(userPrompt).toContain("Aetna");
    expect(userPrompt).toContain("AET12345");
    expect(userPrompt).toContain("CLM-001");
    expect(userPrompt).toContain("$450");
    expect(userPrompt).toContain("Out of Network");
    expect(userPrompt).toContain("No Surprises Act Emergency Protections");
  });

  it("handles empty reference documents cleanly", () => {
    const withoutRefs = { ...baseInput, referenceDocuments: [] };
    const { userPrompt } = buildPrompt(withoutRefs);

    expect(userPrompt).toContain("TRUSTED REFERENCE DOCUMENTS: None provided for this request.");
  });
});
