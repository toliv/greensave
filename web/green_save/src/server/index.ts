import { z } from "zod";

import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  greeting: publicProcedure.query(async () => {
    return "hello";
  }),
});

export type AppRouter = typeof appRouter;
