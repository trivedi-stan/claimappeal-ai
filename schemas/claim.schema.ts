import { z } from "zod";

const cptCodePattern = /^[0-9]{5}[A-Z0-9]?$/;
const diagnosisCodePattern = /^[A-Z][0-9]{2}(\.[A-Z0-9]{1,4})?$/;

export const ClaimInformationSchema = z.object({
  claim_number: z.string().max(100).optional().nullable(),
  date_of_service: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .nullable(),
  provider_name: z.string().max(200).optional().nullable(),
  provider_npi: z
    .string()
    .regex(/^\d{10}$/, "NPI must be exactly 10 digits")
    .optional()
    .nullable()
    .or(z.literal("")),
  cpt_codes: z
    .array(
      z
        .string()
        .regex(cptCodePattern, "Invalid CPT code format")
        .max(10, "CPT code too long")
    )
    .max(20, "Too many CPT codes")
    .optional()
    .nullable(),
  diagnosis_codes: z
    .array(
      z
        .string()
        .regex(diagnosisCodePattern, "Invalid ICD-10 diagnosis code format")
        .max(10, "Diagnosis code too long")
    )
    .max(20, "Too many diagnosis codes")
    .optional()
    .nullable(),
  amount_billed: z
    .number()
    .positive("Amount must be positive")
    .max(9999999, "Amount seems too large")
    .optional()
    .nullable(),
  amount_denied: z
    .number()
    .positive("Amount must be positive")
    .max(9999999, "Amount seems too large")
    .optional()
    .nullable(),
});

export type ClaimInformationInput = z.infer<typeof ClaimInformationSchema>;
