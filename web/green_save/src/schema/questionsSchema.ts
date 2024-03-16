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

export const ElectricitySupplyEnumSchema = z.enum([
  "120V",
  "LargerVoltage",
  "Unknown",
]);

export const WaterHeaterSpaceRestrictionsEnumSchema = z.enum([
  "NONE",
  "LOW_CEILINGS",
  "NARROW_WIDTH",
]);

export type HouseholdSizeEnum = z.infer<typeof HouseholdSizeEnumSchema>;
export type EnergyTypeEnum = z.infer<typeof EnergyTypeEnumSchema>;
export type PropaneVentEnum = z.infer<typeof PropaneVentEnumSchema>;
export type ElectricitySupplyEnum = z.infer<typeof ElectricitySupplyEnumSchema>;
export type WaterHeaterSpaceRestrictionsEnum = z.infer<
  typeof WaterHeaterSpaceRestrictionsEnumSchema
>;

export const ApplianceFinderSchema = z.object({
  zipcode: z.string().min(5).max(5),
  householdSize: z.number().gt(0).lte(7),
  supportedEnergyTypes: z.array(EnergyTypeEnumSchema),
  ventType: PropaneVentEnumSchema.nullable(),
  heaterSpaceRestrictions: z.array(WaterHeaterSpaceRestrictionsEnumSchema),
});

export type ApplianceFinderType = z.infer<typeof ApplianceFinderSchema>;
