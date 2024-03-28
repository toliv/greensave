import { HeaterRecommendationType } from "@/schema/heaterRecommendations";
import {
  PropaneVentEnum,
  WaterHeaterSpaceRestrictionsEnum,
} from "@/schema/questionsSchema";
import { prisma } from "../prisma";
import { sizeRestrictionsFilter } from "./heaterSizeUtils";
import { heaterVentFilter } from "./heaterVentUtils";

// Returns a list of qualified electric heaters with their estimated area-specific usage costs
export const qualifiedPropaneHeaters = async ({
  minPeakFirstHourRating,
  minGallonsPerMinute,
  localizedPropaneCostFactor,
  localizedAnnualWaterHeaterBillCents,
  sizeRestrictions,
  ventType,
}: {
  minPeakFirstHourRating: number;
  minGallonsPerMinute: number;
  localizedPropaneCostFactor: number;
  localizedAnnualWaterHeaterBillCents: number;
  sizeRestrictions: WaterHeaterSpaceRestrictionsEnum[];
  ventType?: PropaneVentEnum;
}): Promise<HeaterRecommendationType[]> => {
  const filteredVentType = ventType ? heaterVentFilter(ventType) : {};
  const sizeRestrictionsQuery = sizeRestrictionsFilter(sizeRestrictions);
  const propaneHeaters = await prisma.waterHeater.findMany({
    where: {
      fuelType: { in: ["Propane", "Natural Gas, Propane"] },
      // Adjust to also include max gallons per minute for these
      OR: [
        { firstHourRatingGallons: { gte: minPeakFirstHourRating } },
        { maxGallonsPerMinute: { gte: minGallonsPerMinute } },
      ],
      priceInCents: { not: null },
      thermsPerYear: { not: null },
      ...filteredVentType,
      ...sizeRestrictionsQuery,
    },
  });
  // Convert this into a HeaterSummary
  const propaneHeaterRecommendations: HeaterRecommendationType[] =
    propaneHeaters.map((heater) => {
      const {
        upfrontCostInCents,
        costInCentsAfterCredits,
        annualSavingsInCents,
      } = calculatePropaneHeaterCosts({
        // We filtered for this being non-null
        // just in case, set price arbitrarily high
        priceInCents: heater.priceInCents ?? 10 * 1000 * 100,
        // The query prevents us from getting records where thermsPerYear is null, but TS doesn't realize it
        thermsPerYear: heater.thermsPerYear ?? 0,
        localizedPropaneCostFactor,
        localizedAnnualWaterHeaterBillCents,
      });
      return {
        id: heater.id,
        energyStarPartner: heater.energyStarPartner,
        brandName: heater.brandName,
        modelName: heater.modelName,
        modelNumber: heater.modelNumber,
        upfrontCostInCents,
        costInCentsAfterCredits,
        annualSavingsInCents,
      };
    });
  return propaneHeaterRecommendations;
};

const calculatePropaneHeaterCosts = ({
  priceInCents,
  thermsPerYear,
  localizedPropaneCostFactor,
  localizedAnnualWaterHeaterBillCents,
}: {
  priceInCents: number;
  thermsPerYear: number;
  localizedPropaneCostFactor: number;
  localizedAnnualWaterHeaterBillCents: number;
}) => {
  const annualCostInCents = localizedPropaneCostFactor * thermsPerYear;
  const upfrontCostInCents = priceInCents;
  const costInCentsAfterCredits =
    upfrontCostInCents -
    Math.min(600 * 100 /*$600 in cents*/, 0.3 * upfrontCostInCents);
  const taxCreditSavings = upfrontCostInCents - costInCentsAfterCredits;
  const annualSavingsInCents =
    localizedAnnualWaterHeaterBillCents - annualCostInCents;
  return {
    upfrontCostInCents,
    costInCentsAfterCredits,
    annualSavingsInCents,
  };
};
