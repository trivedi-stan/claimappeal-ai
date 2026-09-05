import { CreateAppealSchema, UpdateAppealSchema } from "@/schemas/appeal.schema";
import { ClaimInformationSchema } from "@/schemas/claim.schema";
import { DenialInformationSchema } from "@/schemas/denial.schema";
import { InsuranceInformationSchema } from "@/schemas/insurance.schema";

describe("API Schema Validations", () => {
  describe("Appeal Schema", () => {
    it("validates create appeal input", () => {
      const valid = CreateAppealSchema.safeParse({ title: "MRI Denial Appeal" });
      expect(valid.success).toBe(true);

      const empty = CreateAppealSchema.safeParse({});
      expect(empty.success).toBe(true);
    });

    it("validates update appeal input and status enum", () => {
      const valid = UpdateAppealSchema.safeParse({ status: "generated" });
      expect(valid.success).toBe(true);

      const invalid = UpdateAppealSchema.safeParse({ status: "not_a_status" });
      expect(invalid.success).toBe(false);
    });
  });

  describe("Claim Information Schema", () => {
    it("validates valid claim numbers, dates, CPT, and ICD-10 codes", () => {
      const valid = ClaimInformationSchema.safeParse({
        claim_number: "CLM-9988",
        date_of_service: "2026-01-20",
        cpt_codes: ["99213", "70553"],
        diagnosis_codes: ["M54.2", "G43.909"],
        amount_billed: 1500,
        amount_denied: 1200,
      });
      expect(valid.success).toBe(true);
    });

    it("rejects invalid date formats", () => {
      const invalid = ClaimInformationSchema.safeParse({
        date_of_service: "01/20/2026",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("Denial Information Schema", () => {
    it("validates valid denial reason and date", () => {
      const valid = DenialInformationSchema.safeParse({
        denial_reason: "Lack of pre-authorization",
        denial_code: "CO-197",
        denial_date: "2026-02-10",
      });
      expect(valid.success).toBe(true);
    });
  });

  describe("Insurance Information Schema", () => {
    it("validates valid insurance fields", () => {
      const valid = InsuranceInformationSchema.safeParse({
        company: "UnitedHealthcare",
        plan_type: "EPO",
        member_id: "UHC123456",
        group_number: "GRP-88",
      });
      expect(valid.success).toBe(true);
    });
  });
});
