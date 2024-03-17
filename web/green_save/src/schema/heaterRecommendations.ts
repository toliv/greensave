import { z } from "zod";

export const HeaterInfoSchema = z.object({
  energyStarPartner: z.string(),
  brandName: z.string(),
  modelName: z.string(),
  modelNumber: z.string(),
  upfrontCostInCents: z.number().nonnegative(),
  costInCentsAfterCredits: z.number().nonnegative(),
  annualSavingsInCents: z.number(),
});

export type HeaterInfoSchemaType = z.infer<typeof HeaterInfoSchema>;

export const HeaterRecommendationsSchema = z.object({
  bestValueChoice: HeaterInfoSchema,
  ourRecommendation: HeaterInfoSchema,
  ecoFriendly: HeaterInfoSchema,
});

export type HeaterRecommendationsSchemaType = z.infer<
  typeof HeaterRecommendationsSchema
>;
