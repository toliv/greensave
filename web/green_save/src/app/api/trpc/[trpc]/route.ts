import { appRouter } from "@/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: any) => {
  // console.log(await req.json());
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};
export { handler as GET, handler as POST, handler as OPTIONS };
