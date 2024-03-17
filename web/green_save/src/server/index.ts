import {
  HeaterInfoSchemaType,
  HeaterRecommendationsSchema,
  HeaterRecommendationsSchemaType,
} from "@/schema/heaterRecommendations";
import {
  ApplianceFinderSchema,
  ApplianceFinderType,
} from "@/schema/questionsSchema";
import { match } from "assert";
import { z } from "zod";
import { prisma } from "./prisma";

import { publicProcedure, router } from "./trpc";
import {
  electricHeaterToInfoRecord,
  peakFirstHourRatings,
  stateTemperatureFactors,
} from "./utils/heaterPriceUtils";

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
      console.log(opts);
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

      const result = await prisma.userFormSubmission.findFirstOrThrow({
        where: {
          id,
        },
      });
      console.log(result);

      const survey = ApplianceFinderSchema.parse(
        result.submissionData as object,
      );
      console.log(`Survey: ${survey}`);
      console.log(`ZIPCODE: ${survey.zipcode}`);

      const zipCodeInfo = await prisma.zipCodeReference.findFirstOrThrow({
        where: {
          zipCode: "11211",
        },
      });

      console.log(zipCodeInfo);

      const stateFactor = await prisma.stateInputFactor.findFirstOrThrow({
        where: {
          state: zipCodeInfo.stateName,
        },
      });

      // This is region-specific cost parameters.
      const factors = stateTemperatureFactors({ stateFactor });
      console.log(factors);
      const peakFirstHourRating = peakFirstHourRatings[survey.householdSize];

      // Build the filter query for heaters
      let filters = {};
      if (survey.supportedEnergyTypes) {
        const energyTypes: Set<string> = new Set();
        survey.supportedEnergyTypes.forEach((energyType) => {
          // TODO: Rename this in the question schema
          if (energyType === "Electricity") {
            energyTypes.add("Electric");
          }
          if (energyType === "Natural Gas") {
            energyTypes.add("Natural Gas");
            energyTypes.add("Natural Gas, Propane");
          }
          if (energyType === "Propane") {
            energyTypes.add("Propane");
            energyTypes.add("Natural Gas, Propane");
          }
        });

        filters = { ...filters, fuelType: { in: Array.from(energyTypes) } };
      }

      if (survey.ventType) {
        filters = { ...filters, ventType: "Direct Vent" };
      }

      // Find all electric heaters, order by electricUsage
      const matchingElectricHeaters = await prisma.waterHeater.findMany({
        where: {
          fuelType: "Electric",
          firstHourRatingGallons: {
            gte: peakFirstHourRating,
          },
          // Need a price record associated
          priceRecords: {
            some: {},
          },
          // We need this
          electricUsageKWHyear: { not: null },
        },
        include: {
          priceRecords: true,
        },
        orderBy: [
          {
            electricUsageKWHyear: "desc",
          },
        ],
      });
      // TODO: Change schema such that most recent record is auto-linked to heater
      const matchingHeatersWithMostRecentRecord = matchingElectricHeaters.map(
        (wh) => ({
          ...wh,
          priceRecord: wh.priceRecords.sort((a, b) => {
            return b.dateRecorded.valueOf() - a.dateRecorded.valueOf();
          })[0], // Keeps the most recent record based on date_recorded
        }),
      );

      const electricHeaterInfoRecords = matchingHeatersWithMostRecentRecord.map(
        (heater) =>
          electricHeaterToInfoRecord({
            stateInputFactor: factors,
            waterHeaterWithPriceRecord: heater,
          }),
      );

      electricHeaterInfoRecords.sort((a, b) => {
        return a.costInCentsAfterCredits - b.costInCentsAfterCredits;
      });

      console.log(electricHeaterInfoRecords.length);
      console.log(electricHeaterInfoRecords[0]);
      console.log(electricHeaterInfoRecords.at(-1));

      const matchingGasHeaters = await prisma.waterHeater.findMany({
        where: {
          fuelType: { in: ["Natural Gas", "Natural Gas, Propane"] },
          firstHourRatingGallons: {
            gte: peakFirstHourRating,
          },
          // Need a price record associated
          priceRecords: {
            some: {},
          },
          // We need this
          thermsPerYear: { not: null },
        },
        include: {
          priceRecords: true,
        },
        orderBy: [
          {
            thermsPerYear: "desc",
          },
        ],
      });

      const matchingPropaneHeaters = await prisma.waterHeater.findMany({
        where: {
          fuelType: { in: ["Propane", "Natural Gas, Propane"] },
          firstHourRatingGallons: {
            gte: peakFirstHourRating,
          },
          // Need a price record associated
          priceRecords: {
            some: {},
          },
          // We need this
          thermsPerYear: { not: null },
        },
        include: {
          priceRecords: true,
        },
        orderBy: [
          {
            thermsPerYear: "desc",
          },
        ],
      });

      const heater = electricHeaterInfoRecords[0];

      return {
        bestValueChoice: heater,
        ourRecommendation: heater,
        ecoFriendly: heater,
      };
    }),
});

export type AppRouter = typeof appRouter;
