import { buildRebuttalMatrix } from "@/lib/ai/rebuttal-matrix";

describe("buildRebuttalMatrix", () => {
  it("detects medical necessity criteria when clinical evidence is present", () => {
    const analysis = buildRebuttalMatrix({
      denialReason: "Lack of Medical Necessity",
      denialCode: "CO-50",
      denialDescription: "Service not medically necessary without conservative therapy.",
      medicalNecessityExplanation:
        "The patient has had 10 weeks of persistent radicular pain interfering with walking and occupational duties. Completed 6 weeks of supervised physical therapy and oral NSAIDs without relief. Examination demonstrated positive straight leg raise and L5 dermatomal sensory deficit. Lumbar MRI requested to evaluate for structural nerve root compression.",
      cptCodes: ["72148", "97110"],
      diagnosisCodes: ["M54.5", "M51.16"],
      additionalNotes: "Patient has upcoming orthopedic consult.",
    });

    expect(analysis.totalCount).toBe(5);
    expect(analysis.coverageCount).toBeGreaterThanOrEqual(4);
    expect(analysis.strengthRating).toBe("High");
    expect(analysis.coveragePercentage).toBeGreaterThanOrEqual(80);

    const criteriaNames = analysis.criteria.map((c) => c.criterion);
    expect(criteriaNames).toContain("Persistent Symptoms & Chronicity");
    expect(criteriaNames).toContain("Failure of Conservative Therapy");
    expect(criteriaNames).toContain("Objective Neurological / Clinical Findings");
    expect(criteriaNames).toContain("Documented Functional Impairment");
    expect(criteriaNames).toContain("Clinical Indication for Requested Procedure");
  });

  it("flags missing criteria when documentation is sparse", () => {
    const analysis = buildRebuttalMatrix({
      denialReason: "Medical Necessity",
      denialCode: "CO-50",
      denialDescription: "Denial for lack of clinical information",
      medicalNecessityExplanation: "Patient needs this scan.",
      cptCodes: ["72148"],
      diagnosisCodes: ["M54.5"],
      additionalNotes: null,
    });

    expect(analysis.strengthRating).toBe("Needs Documentation");
    expect(analysis.coverageCount).toBeLessThan(3);
    expect(analysis.potentialImprovements.length).toBeGreaterThan(0);
  });

  it("switches to prior authorization criteria for prior auth denials", () => {
    const analysis = buildRebuttalMatrix({
      denialReason: "Prior Authorization Denied",
      denialCode: "CO-197",
      denialDescription: "Precertification / authorization was not obtained prior to service.",
      medicalNecessityExplanation: "Emergency admission required immediate procedure.",
      cptCodes: ["99285"],
      diagnosisCodes: ["R07.9"],
      additionalNotes: null,
    });

    const criteriaNames = analysis.criteria.map((c) => c.criterion);
    expect(criteriaNames).toContain("Prior Authorization Submission Record");
    expect(criteriaNames).toContain("Urgent / Emergency Clinical Need");
  });
});
