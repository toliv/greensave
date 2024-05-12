import { EmailRequestSchema } from "@/schema/emailRequest";
import {
  HeaterRecommendationsSchema,
  HeaterRecommendationType,
} from "@/schema/heaterRecommendations";
import { ApplianceFinderSchema } from "@/schema/questionsSchema";
import { z } from "zod";
import { prisma } from "./prisma";

import { publicProcedure, router } from "./trpc";
import { sendEmailToUser } from "./utils/emails";
import {
  peakFirstHourRatings,
  peakFlowRates,
  stateTemperatureFactors,
} from "./utils/heaterPriceUtils";
import { qualifiedElectricHeaters } from "./utils/qualifiedElectricHeaters";
import { qualifiedGasHeaters } from "./utils/qualifiedGasHeaters";
import { qualifiedPropaneHeaters } from "./utils/qualifiedPropaneHeaters";
import { qualifiedSolarHeaters } from "./utils/qualifiedSolarHeaters";
import { createCallerFactory } from "./trpc";
import { PassThrough } from "stream";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  greeting: publicProcedure.query(async () => {
    return "hello";
  }),
  testMutation: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async (opts) => {
      return "mutation";
    }),
  submitUserFormSubmission: publicProcedure
    .input(ApplianceFinderSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      const { id } = await prisma.userFormSubmission.create({
        data: {
          submissionData: input,
          createdAt: new Date(),
        },
      });
      return { id };
    }),
  getUserFormSubmission: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async (opts) => {
      const {
        input: { id },
      } = opts;
      return await prisma.userFormSubmission.findFirstOrThrow({
        where: {
          id,
        },
      });
    }),
  submitUserEmailRequest: publicProcedure
    .input(EmailRequestSchema)
    .mutation(async ({ input }) => {
      const {
        userEmail,
        contactAllowed,
        selectedHeater,
        userFormSubmissionId,
      } = input;

      const { data, error } = await sendEmailToUser({
        userEmail,
        selectedHeater,
      });
      if (error) {
        console.error(error);
      }
      // Store in the DB for our records
      const dataRec = {
        waterHeaterId: selectedHeater.id,
        contactAllowed,
        userFormSubmissionId,
        createdAt: new Date(),
        resendEmailId: data?.id,
      };
      await prisma.userEmailRequest.create({
        data: dataRec,
      });
      return;
    }),
  getRecommendedHeaters: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .output(HeaterRecommendationsSchema)
    .query(async (opts) => {
      const {
        input: { id },
      } = opts;
      // Pull up the survey result we saved in the DB
      const result = await prisma.userFormSubmission.findFirstOrThrow({
        where: {
          id,
        },
      });
      const survey = ApplianceFinderSchema.parse(
        result.submissionData as object,
      );
      // Find the geographic info for this zip code
      const zipCodeInfo = await prisma.zipCodeReference.findFirstOrThrow({
        where: {
          // TODO: Pull the survey zipcode, validate zipcode on form submission?
          zipCode: survey.zipcode,
        },
      });
      const stateFactor = await prisma.stateInputFactor.findFirstOrThrow({
        where: {
          state: zipCodeInfo.stateName,
        },
      });
      // Find the region-specific cost parameters.
      const {
        electricFactor,
        annualWaterHeaterBillCents,
        temperatureFactor,
        gasFactor,
        propaneFactor,
      } = stateTemperatureFactors({ stateFactor });
      // Match precision from the sheet
      const minPeakFirstHourRating =
        Math.round(
          10 * peakFirstHourRatings[survey.householdSize] * temperatureFactor,
        ) / 10;
      const minGallonsPerMinute =
        peakFlowRates[survey.householdSize] * temperatureFactor;

      let electricHeaters: HeaterRecommendationType[] = [];
      let gasHeaters: HeaterRecommendationType[] = [];
      let propaneHeaters: HeaterRecommendationType[] = [];
      let solarHeaters: HeaterRecommendationType[] = [];
      // Fetch all relevant kinds of data.
      await Promise.all(
        survey.supportedEnergyTypes.map(async (energyType) => {
          if (energyType === "Electric") {
            electricHeaters = await qualifiedElectricHeaters({
              minPeakFirstHourRating,
              localizedElectricCostFactor: electricFactor,
              localizedAnnualWaterHeaterBillCents: annualWaterHeaterBillCents,
              sizeRestrictions: survey.heaterSpaceRestrictions,
            });
          } else if (energyType === "Natural Gas") {
            gasHeaters = await qualifiedGasHeaters({
              minPeakFirstHourRating,
              minGallonsPerMinute,
              localizedGasCostFactor: gasFactor,
              localizedAnnualWaterHeaterBillCents: annualWaterHeaterBillCents,
              sizeRestrictions: survey.heaterSpaceRestrictions,
              // The survey requires this question if Natural Gas selected
              ventType: survey.ventType ? survey.ventType : undefined,
            });
          } else if (energyType === "Propane") {
            propaneHeaters = await qualifiedPropaneHeaters({
              minPeakFirstHourRating,
              minGallonsPerMinute,
              localizedPropaneCostFactor: propaneFactor,
              localizedAnnualWaterHeaterBillCents: annualWaterHeaterBillCents,
              sizeRestrictions: survey.heaterSpaceRestrictions,
              ventType: survey.ventType ? survey.ventType : undefined,
            });
          } else if (energyType === "Solar Panels") {
            solarHeaters = await qualifiedSolarHeaters({
              householdSize: survey.householdSize,
              locatedInSunBelt: zipCodeInfo.isSunBeltLocation,
              averageWinterTemperature: stateFactor.averageWinterTemperature,
              solarTankVolumeMultiplier: stateFactor.solarTankVolumeFactor,
              totalAnnualWaterHeaterCostInCents: annualWaterHeaterBillCents,
            });
          }
        }),
      );
      // Combine all results together
      const allHeaters: HeaterRecommendationType[] = [
        ...electricHeaters,
        ...gasHeaters,
        ...propaneHeaters,
        ...solarHeaters,
      ];

      // Find the cheapest heater with upfront cost.
      const bestValueChoices = [...allHeaters];
      bestValueChoices.sort((a, b) => {
        return a.upfrontCostInCents - b.upfrontCostInCents;
      });
      const brandNameMaps = new Map<string, HeaterRecommendationType>();
      let bestValueChoice = bestValueChoices[0];
      const upfrontCost = bestValueChoice.upfrontCostInCents;
      // Out of the qualified best value choices, pick based on brand preference
      for (const rec of bestValueChoices) {
        if (rec.upfrontCostInCents != upfrontCost) {
          break;
        } else {
          if (!brandNameMaps.has(rec.brandName)) {
            brandNameMaps.set(rec.brandName, rec);
          }
        }
      }
      if (brandNameMaps.has("A. O. Smith")) {
        bestValueChoice = brandNameMaps.get("A. O. Smith") ?? bestValueChoice;
      } else if (brandNameMaps.has("Rinnai")) {
        bestValueChoice = brandNameMaps.get("Rinnai") ?? bestValueChoice;
      } else if (brandNameMaps.has("Rheem")) {
        bestValueChoice = brandNameMaps.get("Rheem") ?? bestValueChoice;
      } else if (brandNameMaps.has("AMERICAN STANDARD WATER HEATERS")) {
        bestValueChoice =
          brandNameMaps.get("AMERICAN STANDARD WATER HEATERS") ??
          bestValueChoice;
      } else if (brandNameMaps.has("Lochnivar")) {
        bestValueChoice = brandNameMaps.get("Lochnivar") ?? bestValueChoice;
      } else if (brandNameMaps.has("Richmond")) {
        bestValueChoice = brandNameMaps.get("Richmond") ?? bestValueChoice;
      } else {
        // do nothing
      }
      // Find the choice with the highest ten year savings
      const ourRecommendations = [...allHeaters];
      ourRecommendations.sort((a, b) => {
        return b.tenYearSavingsInCents - a.tenYearSavingsInCents;
      });
      // Exercise brand preference among this choice as well
      brandNameMaps.clear();
      let ourRecommendation = ourRecommendations[0];
      const tenYearSavingsInCents = bestValueChoice.tenYearSavingsInCents;
      // Out of the qualified best value choices, pick based on brand preference
      for (const rec of ourRecommendations) {
        if (rec.tenYearSavingsInCents != tenYearSavingsInCents) {
          break;
        } else {
          if (!brandNameMaps.has(rec.brandName)) {
            brandNameMaps.set(rec.brandName, rec);
          }
        }
      }
      if (brandNameMaps.has("A. O. Smith")) {
        ourRecommendation =
          brandNameMaps.get("A. O. Smith") ?? ourRecommendation;
      } else if (brandNameMaps.has("Rinnai")) {
        ourRecommendation = brandNameMaps.get("Rinnai") ?? ourRecommendation;
      } else if (brandNameMaps.has("Rheem")) {
        ourRecommendation = brandNameMaps.get("Rheem") ?? ourRecommendation;
      } else if (brandNameMaps.has("AMERICAN STANDARD WATER HEATERS")) {
        ourRecommendation =
          brandNameMaps.get("AMERICAN STANDARD WATER HEATERS") ??
          ourRecommendation;
      } else if (brandNameMaps.has("Lochnivar")) {
        ourRecommendation = brandNameMaps.get("Lochnivar") ?? ourRecommendation;
      } else if (brandNameMaps.has("Richmond")) {
        ourRecommendation = brandNameMaps.get("Richmond") ?? ourRecommendation;
      } else {
        // do nothing
      }
      // Eco-friendly defined as the best ten-year savings if solar, tankless if natural gas, or else heat pump
      // We require independent scans for the most eco-friendly option.
      // If no Solar option is found, proceed to look for Gas Tankless, then Heat Pump
      let ecoFriendly = null;
      const energyTypes = new Set(survey.supportedEnergyTypes);
      if (energyTypes.has("Solar Panels")) {
        for (let heater of ourRecommendations) {
          if (
            heater.heaterType === "Solar with Electric Backup" ||
            heater.heaterType === "Solar with Gas Backup"
          ) {
            ecoFriendly = heater;
            break;
          }
        }
      }
      // If we already found a solar, no need to look for a tankless
      if (
        (!ecoFriendly && energyTypes.has("Natural Gas")) ||
        energyTypes.has("Propane")
      ) {
        for (let heater of ourRecommendations) {
          if (heater.heaterType === "Gas Tankless") {
            ecoFriendly = heater;
            break;
          }
        }
      }
      // If we already found a solar or a tankless, no need to look for a heat pump
      if (!ecoFriendly && energyTypes.has("Electric")) {
        for (let heater of ourRecommendations) {
          if (heater.heaterType === "Hybrid/Electric Heat Pump") {
            ecoFriendly = heater;
            break;
          }
        }
      }

      if (!ecoFriendly) {
        ecoFriendly = ourRecommendation;
      }

      return {
        bestValueChoice,
        ourRecommendation,
        ecoFriendly,
      };
    }),
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
