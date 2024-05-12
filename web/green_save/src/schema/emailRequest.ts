import { z } from "zod";
import {
  HeaterInfoSchema,
  HeaterRecommendationSchema,
} from "./heaterRecommendations";

export const EmailRequestSchema = z.object({
  userEmail: z.string().email(),
  contactAllowed: z.boolean(),
  selectedHeater: HeaterRecommendationSchema,
  userFormSubmissionId: z.string().uuid(),
  recommendationType: z.number(),
});

export type EmailRequestType = z.infer<typeof EmailRequestSchema>;
