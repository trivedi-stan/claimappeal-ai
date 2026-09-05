import { z } from "zod";

export const DenialInformationSchema = z.object({
  denial_reason: z
    .string()
    .min(1, "Denial reason is required")
    .max(2000, "Denial reason is too long"),
  denial_code: z.string().max(50).optional().nullable(),
  denial_description: z.string().max(5000).optional().nullable(),
  denial_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .nullable(),
});

export const SupportingInformationSchema = z.object({
  medical_necessity_explanation: z.string().max(10000).optional().nullable(),
  additional_notes: z.string().max(5000).optional().nullable(),
  prior_appeal_attempts: z.boolean().default(false),
  prior_appeal_details: z.string().max(5000).optional().nullable(),
});

export type DenialInformationInput = z.infer<typeof DenialInformationSchema>;
export type SupportingInformationInput = z.infer<
  typeof SupportingInformationSchema
>;
