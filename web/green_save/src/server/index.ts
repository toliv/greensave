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
      const minPeakFirstHourRating =
        peakFirstHourRatings[survey.householdSize] * temperatureFactor;
      const minGallonsPerMinute =
        peakFlowRates[survey.householdSize] * temperatureFactor;

      let electricHeaters: HeaterRecommendationType[] = [];
      let gasHeaters: HeaterRecommendationType[] = [];
      let propaneHeaters: HeaterRecommendationType[] = [];
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
          }
        }),
      );
      // Combine all results together
      const allHeaters: HeaterRecommendationType[] = [
        ...electricHeaters,
        ...gasHeaters,
        ...propaneHeaters,
      ];
      // Find the cheapest heater with upfront cost.
      const bestValueChoice = allHeaters.sort((a, b) => {
        return a.upfrontCostInCents - b.upfrontCostInCents;
      })[0];
      // Find the choice with the highest annual savings
      const ourRecommendation = [...allHeaters].sort((a, b) => {
        return b.annualSavingsInCents - a.annualSavingsInCents;
      })[0];
      return {
        bestValueChoice,
        ourRecommendation,
        ecoFriendly: bestValueChoice,
      };
    }),
});

export type AppRouter = typeof appRouter;
