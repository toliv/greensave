import { ApplianceFinderSchema } from "@/schema/questionsSchema";

import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  greeting: publicProcedure.query(async () => {
    return "hello";
  }),
  submitUserFormSubmission: publicProcedure
    .input(ApplianceFinderSchema)
    .mutation(async (opts) => {
      const { input } = opts;
      console.log(input);

      return "123";
    }),
});

export type AppRouter = typeof appRouter;
