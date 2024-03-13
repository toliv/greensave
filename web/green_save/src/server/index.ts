import { ApplianceFinderSchema } from "@/schema/questionsSchema";
import { prisma } from "./prisma";

import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  greeting: publicProcedure.query(async () => {
    return "hello";
  }),
  submitUserFormSubmission: publicProcedure
    .input(ApplianceFinderSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      const { id } = await prisma.userFormSubmission.create({
        data: {
          zipcode: input.zipcode,
          householdSize: input.householdSize,
          supportedEnergyTypes: input.supportedEnergyTypes,
          supportedEnergySupply: input.supportedEnergySupply,
          heaterSpaceRestrictions: input.heaterSpaceRestrictions,
          createdAt: new Date(),
        },
      });
      return id;
    }),
});

export type AppRouter = typeof appRouter;
