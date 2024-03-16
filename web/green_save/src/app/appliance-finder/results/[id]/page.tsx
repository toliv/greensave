import { trpc } from "@/app/_trpc/client";

export default function ApplianceFinderResults({
  params,
}: {
  params: { id: string };
}) {
  let { id } = params;
  const { data } = trpc.getUserFormSubmission.useQuery({ id });

  return <h1>ID: {id}</h1>;
}
