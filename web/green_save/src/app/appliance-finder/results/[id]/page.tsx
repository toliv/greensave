"use client";
import { trpc } from "@/app/_trpc/client";

export default function ApplianceFinderResults({
  params,
}: {
  params: { id: string };
}) {
  let { id } = params;
  const { data } = trpc.getUserFormSubmission.useQuery({ id });
  console.log(data?.submissionData);

  return (
    <div className="text-white mt-32">
      <h1>ID: {id}</h1>
    </div>
  );
}
