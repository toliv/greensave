import { z } from "zod";

export const EmailRequestSchema = z.object({
  userEmail: z.string().email(),
  contactAllowed: z.boolean(),
  selectedHeaterId: z.string().uuid(),
});

export type EmailRequestType = z.infer<typeof EmailRequestSchema>;
