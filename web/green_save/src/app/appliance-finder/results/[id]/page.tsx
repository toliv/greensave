import { trpc } from "@/app/_trpc/client";
import { ApplianceFinderResults } from "@/components/ApplianceFinderResults";
import { createCaller } from "@/server";
import {} from "@/server/trpc";

// Server-side component to fetch data upfront
export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const caller = createCaller({});
  const data = await caller.getRecommendedHeaters({ id });
  return <ApplianceFinderResults id={id} data={data} />;
}
