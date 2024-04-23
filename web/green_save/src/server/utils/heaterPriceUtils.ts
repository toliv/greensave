import { HeaterInfoSchemaType } from "@/schema/heaterRecommendations";
import { StateInputFactor, WaterHeater } from "@prisma/client";
import { WaterHeaterWithPriceRecord } from "../types/types";

export type StateTemperatureFactorType = {
  electricFactor: number;
  gasFactor: number;
  propaneFactor: number;
  annualWaterHeaterBillCents: number;
  temperatureFactor: number;
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
    gasFactor: (stateFactor.gasPricePerThousandCubicFeetCents / 10.38) * factor,
    propaneFactor: stateFactor.propanePricePerGallonCents * factor,
    annualWaterHeaterBillCents: annualWaterHeaterBillCents * 0.19,
    temperatureFactor: factor,
  };
};

// Based on number of people, the Peak First Hour Rating they need.
// The array is set up such that peakFirstHourRatings[number_of_people] = needed peak hour rating
export const peakFirstHourRatings = [0, 39, 49, 62, 72, 85, 95, 105];

// Based on number of people, the Peak flow rate in gallons/m they need.
// The array is set up such that peakFlowRates[number_of_people] = needed gallons /m
export const peakFlowRates = [0, 1.8, 3.3, 5.0, 7.3, 8.8, 10.5, 12.0];
