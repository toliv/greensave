import { z } from "zod";

export const HouseholdSizeEnumSchema = z.enum(["1-2", "2-4", "5-6", "7+"]);
export const EnergyTypeEnumSchema = z.enum([
  "Electricity",
  "Natural Gas",
  "Propane",
  "Solar Panels",
  "Other",
]);
export const PropaneVentEnumSchema = z.enum([
  "Traditional Atmospheric Vent",
  "Direct Vent",
  "Power Vent",
  "Power Direct Vent",
  "Unknown/Other",
]);

export type HouseholdSizeEnum = z.infer<typeof HouseholdSizeEnumSchema>;
export type EnergyTypeEnum = z.infer<typeof EnergyTypeEnumSchema>;
export type PropaneVentEnumSchema = z.infer<typeof PropaneVentEnumSchema>;

export const ApplianceFinderSchema = z.object({
  zipcode: z.string().min(5).max(5),
  householdSize: HouseholdSizeEnumSchema.nullable(),
  supportedEnergyTypes: z.array(EnergyTypeEnumSchema),
  ventType: PropaneVentEnumSchema.nullable(),
});

export type ApplianceFinder = z.infer<typeof ApplianceFinderSchema>;