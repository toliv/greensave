import { appRouter } from "@/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: any) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
