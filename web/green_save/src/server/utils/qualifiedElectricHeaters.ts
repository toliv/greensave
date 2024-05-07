import { HeaterRecommendationType } from "@/schema/heaterRecommendations";
import { WaterHeaterSpaceRestrictionsEnum } from "@/schema/questionsSchema";
import { WaterHeater } from "@prisma/client";
import { prisma } from "../prisma";
import { sizeRestrictionsFilter } from "./heaterSizeUtils";

// Returns a list of qualified electric heaters with their estimated area-specific usage costs
export const qualifiedElectricHeaters = async ({
  minPeakFirstHourRating,
  localizedElectricCostFactor,
  localizedAnnualWaterHeaterBillCents,
  sizeRestrictions,
}: {
  minPeakFirstHourRating: number;
  localizedElectricCostFactor: number;
  localizedAnnualWaterHeaterBillCents: number;
  sizeRestrictions: WaterHeaterSpaceRestrictionsEnum[];
}): Promise<HeaterRecommendationType[]> => {
  const sizeRestrictionsQuery = sizeRestrictionsFilter(sizeRestrictions);

  const electricHeaters = await prisma.waterHeater.findMany({
    where: {
      fuelType: "Electric",
      firstHourRatingGallons: { gt: minPeakFirstHourRating },
      // We require that at least one price record is present
      priceInCents: { not: null },
      electricUsageKWHyear: { not: null },
      ...sizeRestrictionsQuery,
    },
  });

  // Convert this into a HeaterSummary
  const electricHeaterInfoRecords: HeaterRecommendationType[] =
    electricHeaters.map((heater) => {
      const {
        upfrontCostInCents,
        costInCentsAfterCredits,
        annualSavingsInCents,
        tenYearSavingsInCents,
        savingsRate,
      } = calculateElectricHeaterCosts({
        // We filtered for this being non-null
        // just in case, set price arbitrarily high
        priceInCents: heater.priceInCents ?? 10 * 1000 * 100,
        // The query prevents us from getting records where electricUsageKHWyear is null, but TS doesn't realize it
        electricUsageKHWyear: heater.electricUsageKWHyear ?? 0,
        localizedElectricCostFactor,
        localizedAnnualWaterHeaterBillCents,
      });
      return {
        id: heater.id,
        energyStarUniqueId: heater.energyStarUniqueId,
        energyStarPartner: heater.energyStarPartner,
        heaterType: heater.heaterType,
        brandName: heater.brandName,
        modelName: heater.modelName,
        modelNumber: heater.modelNumber,
        upfrontCostInCents,
        costInCentsAfterCredits,
        annualSavingsInCents,
        tenYearSavingsInCents,
        savingsRate,
        fuelType: "Electricity",
      };
    });
  return electricHeaterInfoRecords;
};

const calculateElectricHeaterCosts = ({
  priceInCents,
  electricUsageKHWyear,
  localizedElectricCostFactor,
  localizedAnnualWaterHeaterBillCents,
}: {
  priceInCents: number;
  electricUsageKHWyear: number;
  localizedElectricCostFactor: number;
  localizedAnnualWaterHeaterBillCents: number;
}) => {
  const annualCostInCents = localizedElectricCostFactor * electricUsageKHWyear;
  const upfrontCostInCents = priceInCents;
  const costInCentsAfterCredits =
    upfrontCostInCents -
    Math.min(600 * 100 /*$600 in cents*/, 0.3 * upfrontCostInCents);
  const savingsRate =
    1 - annualCostInCents / localizedAnnualWaterHeaterBillCents;
  const taxCreditSavings = upfrontCostInCents - costInCentsAfterCredits;
  const annualSavingsInCents =
    localizedAnnualWaterHeaterBillCents - annualCostInCents;
  const tenYearSavingsInCents =
    10 * localizedAnnualWaterHeaterBillCents * savingsRate -
    costInCentsAfterCredits;
  return {
    upfrontCostInCents,
    costInCentsAfterCredits,
    annualSavingsInCents,
    tenYearSavingsInCents,
    savingsRate,
  };
};
