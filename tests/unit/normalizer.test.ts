import { normalizeAppealInput } from "@/lib/ai/normalizer";
import type { Appeal } from "@/types";

describe("normalizeAppealInput", () => {
  const mockAppeal: Appeal = {
    id: "appeal-123",
    profile_id: "user-456",
    title: "Denial of MRI",
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    insurance_information: {
      id: "ins-1",
      appeal_id: "appeal-123",
      company: "Blue Cross Blue Shield",
      plan_type: "PPO",
      member_id: "BCBS998877",
      group_number: "GRP001",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    claim_information: {
      id: "claim-1",
      appeal_id: "appeal-123",
      claim_number: "CLM-2026-909",
      date_of_service: "2026-01-15",
      provider_name: "St. Jude Hospital",
      provider_npi: "1234567890",
      cpt_codes: ["70553", "70551"],
      diagnosis_codes: ["M54.2"],
      amount_billed: 3200,
      amount_denied: 2800,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    denial_information: {
      id: "denial-1",
      appeal_id: "appeal-123",
      denial_reason: "Medical Necessity",
      denial_code: "CO-50",
      denial_description: "Procedure deemed not medically necessary without prior conservative therapy.",
      denial_date: "2026-02-01",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };

  it("normalizes complete appeal data correctly", () => {
    const references = [
      { title: "ACA Medical Necessity Standard", content: "Section 2719 requires fair appeals..." },
    ];
    const normalized = normalizeAppealInput(
      mockAppeal,
      "John Doe",
      {
        medical_necessity_explanation: "Patient completed 8 weeks of physical therapy.",
        additional_notes: "Previous appeal was verbally denied.",
        prior_appeal_attempts: true,
        prior_appeal_details: "Called representative on Jan 20.",
      },
      references
    );

    expect(normalized.patientName).toBe("John Doe");
    expect(normalized.insuranceCompany).toBe("Blue Cross Blue Shield");
    expect(normalized.memberId).toBe("BCBS998877");
    expect(normalized.claimNumber).toBe("CLM-2026-909");
    expect(normalized.amountDenied).toBe(2800);
    expect(normalized.denialReason).toBe("Medical Necessity");
    expect(normalized.medicalNecessityExplanation).toContain("8 weeks of physical therapy");
    expect(normalized.referenceDocuments).toHaveLength(1);
    expect(normalized.priorAppealAttempts).toBe(true);
  });

  it("handles missing relations gracefully with default placeholders", () => {
    const bareAppeal: Appeal = {
      id: "appeal-bare",
      profile_id: "user-456",
      title: null,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const normalized = normalizeAppealInput(bareAppeal, "Jane Doe", {}, []);

    expect(normalized.patientName).toBe("Jane Doe");
    expect(normalized.insuranceCompany).toBe("Information not provided");
    expect(normalized.denialReason).toBe("Information not provided");
    expect(normalized.claimNumber).toBeNull();
    expect(normalized.amountBilled).toBeNull();
    expect(normalized.referenceDocuments).toHaveLength(0);
    expect(normalized.priorAppealAttempts).toBe(false);
  });
});
