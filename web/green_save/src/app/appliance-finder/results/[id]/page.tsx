"use client";
import { trpc } from "@/app/_trpc/client";

export default function ApplianceFinderResults({
  params,
}: {
  params: { id: string };
}) {
  let { id } = params;
  const { data } = trpc.getRecommendedHeaters.useQuery({ id });
  console.log(data);
  return (
    <div className="w-screen h-screen bg-white">
      <div className="text-black mt-32">
        <h1>ID: {id}</h1>
      </div>
    </div>
  );
}
