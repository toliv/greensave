import { ApplianceFinderSchema } from "@/schema/questionsSchema";
import { z } from "zod";
import { prisma } from "./prisma";

import { publicProcedure, router } from "./trpc";

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
});

export type AppRouter = typeof appRouter;
