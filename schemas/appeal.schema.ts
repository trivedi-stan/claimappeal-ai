import { z } from "zod";

export const AppealStatusSchema = z.enum([
  "draft",
  "in_progress",
  "generated",
  "submitted",
  "approved",
  "denied",
]);

export const CreateAppealSchema = z.object({
  title: z.string().max(200).optional(),
});

export const UpdateAppealSchema = z.object({
  title: z.string().max(200).optional(),
  status: AppealStatusSchema.optional(),
});

export type CreateAppealInput = z.infer<typeof CreateAppealSchema>;
export type UpdateAppealInput = z.infer<typeof UpdateAppealSchema>;
