import { HeaterRecommendationType } from "@/schema/heaterRecommendations";
import {
  PropaneVentEnum,
  WaterHeaterSpaceRestrictionsEnum,
} from "@/schema/questionsSchema";
import { prisma } from "../prisma";
import { sizeRestrictionsFilter } from "./heaterSizeUtils";
import { heaterVentFilter } from "./heaterVentUtils";

// Returns a list of qualified electric heaters with their estimated area-specific usage costs
export const qualifiedGasHeaters = async ({
  minPeakFirstHourRating,
  minGallonsPerMinute,
  localizedGasCostFactor,
  localizedAnnualWaterHeaterBillCents,
  sizeRestrictions,
  ventType,
}: {
  minPeakFirstHourRating: number;
  minGallonsPerMinute: number;
  localizedGasCostFactor: number;
  localizedAnnualWaterHeaterBillCents: number;
  sizeRestrictions: WaterHeaterSpaceRestrictionsEnum[];
  ventType?: PropaneVentEnum;
}): Promise<HeaterRecommendationType[]> => {
  const filteredVentType = ventType ? heaterVentFilter(ventType) : {};
  const sizeRestrictionsQuery = sizeRestrictionsFilter(sizeRestrictions);
  // Gas Tankless uses gallons per minute metric
  const gasTanklessHeaters = await prisma.waterHeater.findMany({
    where: {
      maxGallonsPerMinute: { gte: minGallonsPerMinute },
      // We require that at least one price record is present
      heaterType: "Gas Tankless",
      priceInCents: { not: null },
      thermsPerYear: { not: null },
      ...filteredVentType,
      ...sizeRestrictionsQuery,
    },
  });
  // Storage heaters rely on peak first hour rating
  const gasStorageHeaters = await prisma.waterHeater.findMany({
    where: {
      heaterType: {
        in: ["Gas Storage", "Gas-fired Storage Residential-duty Commercial"],
      },
      firstHourRatingGallons: { gte: minPeakFirstHourRating },
      // We require that at least one price record is present
      priceInCents: { not: null },
      thermsPerYear: { not: null },
      ...filteredVentType,
    },
  });
  const allGasHeaters = [...gasTanklessHeaters, ...gasStorageHeaters];

  // Convert this into a HeaterSummary
  const gasHeaterRecommendations: HeaterRecommendationType[] =
    allGasHeaters.map((heater) => {
      const {
        upfrontCostInCents,
        costInCentsAfterCredits,
        annualSavingsInCents,
        tenYearSavingsInCents,
      } = calculateGasHeaterCosts({
        // We filtered for this being non-null
        // just in case, set price arbitrarily high
        priceInCents: heater.priceInCents ?? 10 * 1000 * 100,
        // The query prevents us from getting records where thermsPerYear is null, but TS doesn't realize it
        thermsPerYear: heater.thermsPerYear ?? 0,
        localizedGasCostFactor,
        localizedAnnualWaterHeaterBillCents,
      });
      return {
        id: heater.id,
        energyStarUniqueId: heater.energyStarUniqueId,
        energyStarPartner: heater.energyStarPartner,
        brandName: heater.brandName,
        modelName: heater.modelName,
        modelNumber: heater.modelNumber,
        upfrontCostInCents,
        costInCentsAfterCredits,
        annualSavingsInCents,
        tenYearSavingsInCents,
      };
    });
  return gasHeaterRecommendations;
};

const calculateGasHeaterCosts = ({
  priceInCents,
  thermsPerYear,
  localizedGasCostFactor,
  localizedAnnualWaterHeaterBillCents,
}: {
  priceInCents: number;
  thermsPerYear: number;
  localizedGasCostFactor: number;
  localizedAnnualWaterHeaterBillCents: number;
}) => {
  const annualCostInCents = localizedGasCostFactor * thermsPerYear;
  const upfrontCostInCents = priceInCents;
  const costInCentsAfterCredits =
    upfrontCostInCents -
    Math.min(600 * 100 /*$600 in cents*/, 0.3 * upfrontCostInCents);
  const taxCreditSavings = upfrontCostInCents - costInCentsAfterCredits;
  const annualSavingsInCents =
    localizedAnnualWaterHeaterBillCents - annualCostInCents;
  const savingsRate =
    1 - annualCostInCents / localizedAnnualWaterHeaterBillCents;
  const tenYearSavingsInCents =
    10 * localizedAnnualWaterHeaterBillCents * savingsRate -
    costInCentsAfterCredits;

  return {
    upfrontCostInCents,
    costInCentsAfterCredits,
    annualSavingsInCents,
    tenYearSavingsInCents,
  };
};
