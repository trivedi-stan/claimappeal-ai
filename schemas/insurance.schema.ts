import { z } from "zod";

export const InsuranceInformationSchema = z.object({
  company: z
    .string()
    .min(1, "Insurance company is required")
    .max(200, "Insurance company name is too long"),
  plan_type: z.string().max(100).optional().nullable(),
  member_id: z.string().max(100).optional().nullable(),
  group_number: z.string().max(100).optional().nullable(),
});

export type InsuranceInformationInput = z.infer<
  typeof InsuranceInformationSchema
>;
