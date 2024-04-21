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

export const HeaterRecommendationSchema = z.object({
  id: z.string(),
  energyStarUniqueId: z.string(),
  energyStarPartner: z.string(),
  brandName: z.string(),
  modelName: z.string(),
  modelNumber: z.string(),
  upfrontCostInCents: z.number().nonnegative(),
  costInCentsAfterCredits: z.number().nonnegative(),
  annualSavingsInCents: z.number(),
  tenYearSavingsInCents: z.number(),
});

export type HeaterRecommendationType = z.infer<
  typeof HeaterRecommendationSchema
>;

export type HeaterInfoSchemaType = z.infer<typeof HeaterInfoSchema>;

export const HeaterRecommendationsSchema = z.object({
  bestValueChoice: HeaterRecommendationSchema,
  ourRecommendation: HeaterRecommendationSchema,
  ecoFriendly: HeaterRecommendationSchema,
});

export type HeaterRecommendationsSchemaType = z.infer<
  typeof HeaterRecommendationsSchema
>;
