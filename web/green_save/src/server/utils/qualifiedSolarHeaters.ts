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
  // We are hardcoding solar heaters based on household size for now.

  let energyStarId = "2408185";
  switch (householdSize) {
    case 1:
      energyStarId = "2408185";
      break;
    case 2:
      energyStarId = "2407986";
      break;
    case 3:
      energyStarId = "2407988";
      break;
    case 4:
      energyStarId = "2407988";
      break;
    case 5:
      energyStarId = "2409760";
      break;
    case 6:
      energyStarId = "2409760";
      break;
    default:
      energyStarId = "2409760";
      break;
  }

  // This should be unique, but haven't bothered to put the unique constraint in DB
  const heaters = await prisma.waterHeater.findMany({
    where: {
      energyStarUniqueId: energyStarId,
    },
  });

  return heaters.map((heater) => {
    const {
      upfrontCostInCents,
      costInCentsAfterCredits,
      annualSavingsInCents,
      tenYearSavingsInCents,
      savingsRate,
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
      savingsRate,
    };
  });
};

export const qualifiedSolarHeaters___old = async ({
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
      savingsRate,
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
      savingsRate,
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
  const savingsRate = 1 - 1 / solarEnergyFactor;
  const costInCentsAfterCredits = priceInCents - priceInCents * 0.3;
  const annualSavingsInCents = savingsRate * totalAnnualWaterHeaterCostInCents;
  const tenYearSavingsInCents =
    10 * totalAnnualWaterHeaterCostInCents * savingsRate -
    costInCentsAfterCredits;
  return {
    upfrontCostInCents: priceInCents,
    costInCentsAfterCredits,
    annualSavingsInCents,
    tenYearSavingsInCents,
    savingsRate,
  };
};
