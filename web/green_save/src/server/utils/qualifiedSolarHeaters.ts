import { HeaterRecommendationType } from "@/schema/heaterRecommendations";
import { prisma } from "../prisma";

export const qualifiedSolarHeaters = async ({
  householdSize,
  locatedInSunBelt,
  averageWinterTemperature,
  solarTankVolumeMultiplier,
  totalAnnualWaterHeaterCostInCents,
}: {
  householdSize: number;
  locatedInSunBelt: boolean;
  averageWinterTemperature: number;
  solarTankVolumeMultiplier: number;
  totalAnnualWaterHeaterCostInCents: number;
}): Promise<HeaterRecommendationType[]> => {
  // when is solar tank vol false ?
  const minSolarCollectorPanelArea = solarCollectorPanelArea(
    householdSize,
    locatedInSunBelt,
  );
  const solarFreezeToleranceLimit = averageWinterTemperature;
  const activeSolarTankVolume =
    minSolarCollectorPanelArea * solarTankVolumeMultiplier;
  const passiveSolarTankVolume = householdSize * 20;

  // Filter Solar w Gas Backup, Solar w Electric Backup
  const forcedCirculationHeaters = await prisma.waterHeater.findMany({
    where: {
      solarCollectorPanelAreaSqFt: {
        gte: minSolarCollectorPanelArea,
      },
      solarFreezeToleranceLimitFahrenheit: {
        gte: solarFreezeToleranceLimit,
      },
      solarSystemType: {
        in: ["Direct Forced Circulation", "Indirect Forced Circulation"],
      },
      solarTankVolumeGallons: {
        gte: activeSolarTankVolume,
      },
      priceInCents: { not: null },
    },
  });

  const nonForcedCirculationHeaters = await prisma.waterHeater.findMany({
    where: {
      solarCollectorPanelAreaSqFt: {
        gte: minSolarCollectorPanelArea,
      },
      solarFreezeToleranceLimitFahrenheit: {
        gte: solarFreezeToleranceLimit,
      },
      solarSystemType: {
        in: ["Direct Thermosyphon", "Indirect Thermosyphon", "Direct ICS"],
      },
      solarTankVolumeGallons: {
        gte: passiveSolarTankVolume,
      },
      priceInCents: { not: null },
    },
  });

  const recs = [
    ...forcedCirculationHeaters,
    ...nonForcedCirculationHeaters,
  ].map((heater) => {
    const {
      upfrontCostInCents,
      costInCentsAfterCredits,
      annualSavingsInCents,
      tenYearSavingsInCents,
    } = calculateSolarHeaterCosts({
      // We filtered for this being non-null
      // just in case, set price arbitrarily high
      priceInCents: heater.priceInCents ?? 10 * 1000 * 100,
      // The query prevents us from getting records where solarEnergyFactor is null, but TS doesn't realize it
      solarEnergyFactor: heater.solarUniformEnergyFactor ?? 0,
      totalAnnualWaterHeaterCostInCents,
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
    };
  });

  // Filter Direct Forced Circulation, Indirect Forced Circulation, Direct Thermosyphon, Indirect Thermosyphon, Direct ICS
  return recs;
};

// This is a version of spreadsheet forumla
function solarCollectorPanelArea(
  householdSize: number,
  isSunBeltLocation: boolean,
): number {
  // Calculate the minimum value between b12 and 2, then multiply by 20
  const part1 = 20 * Math.min(householdSize, 2);
  // Determine the value to use based on the boolean b19
  const ifValue = isSunBeltLocation ? 8 : 12;
  // Calculate the maximum value between 0 and (b12 - 2)
  const part2 = ifValue * Math.max(0, householdSize - 2);
  // Return the sum of part1 and part2
  return part1 + part2;
}

const calculateSolarHeaterCosts = ({
  priceInCents,
  solarEnergyFactor,
  totalAnnualWaterHeaterCostInCents,
}: {
  priceInCents: number;
  solarEnergyFactor: number;
  totalAnnualWaterHeaterCostInCents: number;
}) => {
  const savings = 1 - 1 / solarEnergyFactor;
  const costInCentsAfterCredits = priceInCents - priceInCents * 0.3;
  const annualSavingsInCents = savings * totalAnnualWaterHeaterCostInCents;
  const tenYearSavingsInCents =
    10 * totalAnnualWaterHeaterCostInCents * savings - costInCentsAfterCredits;
  return {
    upfrontCostInCents: priceInCents,
    costInCentsAfterCredits,
    annualSavingsInCents,
    tenYearSavingsInCents,
  };
};
