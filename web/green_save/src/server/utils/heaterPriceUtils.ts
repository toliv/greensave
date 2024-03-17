import { HeaterInfoSchemaType } from "@/schema/heaterRecommendations";
import { StateInputFactor, WaterHeater } from "@prisma/client";
import { WaterHeaterWithPriceRecord } from "../types/types";

export type StateTemperatureFactorType = {
  electricFactor: number;
  gasFactor: number;
  propaneFactor: number;
  annualWaterHeaterBillCents: number;
};

export const stateTemperatureFactors = ({
  stateFactor,
}: {
  stateFactor: StateInputFactor;
}): StateTemperatureFactorType => {
  let annualWaterHeaterBillCents = 0;
  // For the states we don't have the info, assume some default
  if (
    !(
      stateFactor.monthlyElectricityBillCents && stateFactor.monthlyGasBillCents
    )
  ) {
    annualWaterHeaterBillCents = 100 * 100 * 12; // $100 mo / * 100 cents/ dollar * 12 months
  } else {
    annualWaterHeaterBillCents =
      (stateFactor.monthlyElectricityBillCents +
        stateFactor.monthlyGasBillCents) *
      12;
  }
  // Is this static ?
  const percentageAttributableToWaterHeaters = 19 / 100; // 19%
  // Is 120.0 static ?
  const groundwaterTempDiff = 120.0 - stateFactor.groundwaterTemperature;
  const incomingWaterTempDiff = 120.0 - 50;
  // This factor * (energy cost) * (energy use)
  const factor = groundwaterTempDiff / incomingWaterTempDiff;
  // Need to divide electricity price by 100 for units
  return {
    electricFactor: (stateFactor.electricityPriceCentsPerKwh / 100) * factor,
    gasFactor: stateFactor.gasPricePerThousandCubicFeetCents * factor,
    propaneFactor: stateFactor.propanePricePerGallonCents * factor,
    annualWaterHeaterBillCents: annualWaterHeaterBillCents * 0.19,
  };
};

export const peakFirstHourRatings = [0, 39, 49, 62, 72, 85, 95, 105];

export const electricHeaterToInfoRecord = ({
  stateInputFactor,
  waterHeaterWithPriceRecord,
}: {
  stateInputFactor: StateTemperatureFactorType;
  waterHeaterWithPriceRecord: WaterHeaterWithPriceRecord;
}): HeaterInfoSchemaType => {
  if (!waterHeaterWithPriceRecord.electricUsageKWHyear) {
    throw new Error("heater has no electric usage");
  }
  const energyUsage = waterHeaterWithPriceRecord.electricUsageKWHyear;
  const annualCostInCents = stateInputFactor.electricFactor * energyUsage;
  const upfrontCostInCents =
    waterHeaterWithPriceRecord.priceRecord.priceInCents;
  const costInCentsAfterCredits =
    upfrontCostInCents -
    Math.min(600 * 100 /*$600 in cents*/, 0.3 * upfrontCostInCents);
  const taxCreditSavings = upfrontCostInCents - costInCentsAfterCredits;
  const annualSavingsInCents =
    stateInputFactor.annualWaterHeaterBillCents - annualCostInCents;
  return {
    energyStarPartner: waterHeaterWithPriceRecord.energyStarPartner,
    brandName: waterHeaterWithPriceRecord.brandName,
    modelName: waterHeaterWithPriceRecord.modelName,
    modelNumber: waterHeaterWithPriceRecord.modelNumber,
    upfrontCostInCents,
    costInCentsAfterCredits,
    annualSavingsInCents,
  };
};

export const gasHeaterToInfoRecord = ({
  stateInputFactor,
  waterHeaterWithPriceRecord,
}: {
  stateInputFactor: StateTemperatureFactorType;
  waterHeaterWithPriceRecord: WaterHeaterWithPriceRecord;
}): HeaterInfoSchemaType => {
  if (!waterHeaterWithPriceRecord.thermsPerYear) {
    throw new Error("heater has no gas usage");
  }
  const energyUsage = waterHeaterWithPriceRecord.thermsPerYear;
  const annualCostInCents = stateInputFactor.gasFactor * energyUsage;
  const upfrontCostInCents =
    waterHeaterWithPriceRecord.priceRecord.priceInCents;
  const costInCentsAfterCredits =
    upfrontCostInCents -
    Math.min(600 * 100 /*$600 in cents*/, 0.3 * upfrontCostInCents);
  const taxCreditSavings = upfrontCostInCents - costInCentsAfterCredits;
  const annualSavingsInCents =
    annualCostInCents - stateInputFactor.annualWaterHeaterBillCents;
  return {
    energyStarPartner: waterHeaterWithPriceRecord.energyStarPartner,
    brandName: waterHeaterWithPriceRecord.brandName,
    modelName: waterHeaterWithPriceRecord.modelName,
    modelNumber: waterHeaterWithPriceRecord.modelNumber,
    upfrontCostInCents,
    costInCentsAfterCredits,
    annualSavingsInCents,
  };
};

// Need gallons per year for propane
export const propaneHeaterToInfoRecord = ({
  stateInputFactor,
  waterHeaterWithPriceRecord,
}: {
  stateInputFactor: StateTemperatureFactorType;
  waterHeaterWithPriceRecord: WaterHeaterWithPriceRecord;
}): HeaterInfoSchemaType => {
  if (!waterHeaterWithPriceRecord.thermsPerYear) {
    throw new Error("heater has no gas usage");
  }
  const energyUsage = waterHeaterWithPriceRecord.thermsPerYear;
  const annualCostInCents = stateInputFactor.gasFactor * energyUsage;
  const upfrontCostInCents =
    waterHeaterWithPriceRecord.priceRecord.priceInCents;
  const costInCentsAfterCredits =
    upfrontCostInCents -
    Math.min(600 * 100 /*$600 in cents*/, 0.3 * upfrontCostInCents);
  const taxCreditSavings = upfrontCostInCents - costInCentsAfterCredits;
  const annualSavingsInCents =
    annualCostInCents - stateInputFactor.annualWaterHeaterBillCents;
  return {
    energyStarPartner: waterHeaterWithPriceRecord.energyStarPartner,
    brandName: waterHeaterWithPriceRecord.brandName,
    modelName: waterHeaterWithPriceRecord.modelName,
    modelNumber: waterHeaterWithPriceRecord.modelNumber,
    upfrontCostInCents,
    costInCentsAfterCredits,
    annualSavingsInCents,
  };
};
