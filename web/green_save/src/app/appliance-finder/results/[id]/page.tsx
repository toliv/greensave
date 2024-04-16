"use client";
import { displayDollar } from "@/app/utils/displayDollar";
import { trpc } from "@/app/_trpc/client";
import { HeaterInfoSchemaType } from "@/schema/heaterRecommendations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Input, Spinner } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const RECOMMENDATION_TYPE = {
  BEST_VALUE_TODAY: 0,
  OUR_RECOMMENDATION: 1,
  ECO_FRIENDLY: 2,
};

const EmailFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type EmailFormSchemaType = z.infer<typeof EmailFormSchema>;

export default function ApplianceFinderResults({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const { data } = trpc.getRecommendedHeaters.useQuery({ id });
  const [selectedOption, setSelectedOption] = useState<number>(
    RECOMMENDATION_TYPE.OUR_RECOMMENDATION,
  );
  const [sendEmailChoice, setSendEmailChoice] = useState<boolean>(false);
  const [allowContact, setAllowContact] = useState<boolean>(false);
  const { register, handleSubmit, formState } = useForm<EmailFormSchemaType>({
    resolver: zodResolver(EmailFormSchema),
    mode: "onBlur",
  });

  const emailMutationFn = trpc.submitUserEmailRequest.useMutation({
    onSuccess: () => {
      router.push(`/appliance-finder/success`);
    },
  });

  const onSubmit: SubmitHandler<EmailFormSchemaType> = async (formData) => {
    if (data) {
      let selectedHeater;
      switch (selectedOption) {
        case RECOMMENDATION_TYPE.BEST_VALUE_TODAY:
          selectedHeater = data.bestValueChoice;
        case RECOMMENDATION_TYPE.OUR_RECOMMENDATION:
          selectedHeater = data.ourRecommendation;
        case RECOMMENDATION_TYPE.ECO_FRIENDLY:
          selectedHeater = data.ecoFriendly;
      }
      if (selectedHeater) {
        await emailMutationFn.mutate({
          userEmail: formData.email,
          contactAllowed: allowContact,
          selectedHeater,
          userFormSubmissionId: id,
        });
      }
    }
  };

  return (
    <div className="w-screen min-h-screen h-full bg-white">
      <div className="text-black mt-20 px-8 pb-8">
        <div className="">
          {/* TODO: Suspense + wait for load */}
          {data && (
            <>
              <div className="flex flex-col md:flex-row ">
                <HeaterCard
                  heater={data.bestValueChoice}
                  title={"Best value today"}
                  selected={
                    selectedOption === RECOMMENDATION_TYPE.BEST_VALUE_TODAY
                  }
                  setSelected={() =>
                    setSelectedOption(RECOMMENDATION_TYPE.BEST_VALUE_TODAY)
                  }
                  recType={RECOMMENDATION_TYPE.BEST_VALUE_TODAY}
                />
                <HeaterCard
                  heater={data.ourRecommendation}
                  title={"Our recommendation"}
                  selected={
                    selectedOption === RECOMMENDATION_TYPE.OUR_RECOMMENDATION
                  }
                  setSelected={() =>
                    setSelectedOption(RECOMMENDATION_TYPE.OUR_RECOMMENDATION)
                  }
                  recType={RECOMMENDATION_TYPE.OUR_RECOMMENDATION}
                />
                <HeaterCard
                  heater={data.ecoFriendly}
                  title={"Best for the environment"}
                  selected={selectedOption === RECOMMENDATION_TYPE.ECO_FRIENDLY}
                  setSelected={() =>
                    setSelectedOption(RECOMMENDATION_TYPE.ECO_FRIENDLY)
                  }
                  recType={RECOMMENDATION_TYPE.ECO_FRIENDLY}
                />
              </div>
            </>
          )}
        </div>
        <div className="ml-4 mt-4 ">
          <div className="text-2xl">{`Want to save these recommendations for later?`}</div>
          <div className="flex gap-2 items-center py-2 ml-4">
            <div>
              <Checkbox
                crossOrigin={""}
                checked={sendEmailChoice}
                onChange={() => setSendEmailChoice((choice) => !choice)}
              ></Checkbox>
            </div>
            <div className="text-sm">
              Send me an email with all the water heater details
            </div>
          </div>
          <div className="flex gap-2 items-center py-2 ml-4">
            <div>
              <Checkbox
                crossOrigin={""}
                checked={allowContact}
                onChange={() =>
                  setAllowContact((allowContact) => !allowContact)
                }
              ></Checkbox>
            </div>
            <div className="text-sm">
              I want Green<span className="text-standard-green">$ave</span> to
              contact me regarding purchase and installation
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 justify-between items-center py-6 w-full lg:w-1/2 ">
              <div className="w-full lg:w-2/3">
                <Input
                  {...register("email")}
                  crossOrigin=""
                  variant="outlined"
                  size="lg"
                  placeholder="Enter your email"
                  autoComplete="off"
                  className={`text-black font-thin rounded-lg p-4 text-center border-2 border-slate-400 ${formState.errors.email ? "border-red-400" : ""}`}
                />
              </div>
              <div className="w-full lg:w-1/3 text-sm">
                <Button
                  type={"submit"}
                  variant="filled"
                  placeholder="something"
                  onClick={() => {}}
                  disabled={false}
                  className={`h-14 text-black px-12 ${formState.isValid ? "bg-standard-green hover:cursor-pointer" : "bg-slate-400 hover:cursor-not-allowed"}`}
                >
                  {emailMutationFn.isPending ? <Spinner></Spinner> : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const HeaterCard = ({
  heater,
  title,
  selected,
  setSelected,
  recType,
}: {
  heater: HeaterInfoSchemaType;
  title: string;
  selected: boolean;
  setSelected: () => void;
  recType: number;
}) => {
  return (
    <div
      className={`flex-1 border-1 rounded-md m-2 p-4 shadow-md  hover:cursor-pointer ${selected ? "bg-gray-100 shadow-lg border-standard-green" : "bg-white border-black"}`}
      onClick={setSelected}
    >
      <div className="text-3xl text-standard-green mb-4">{title}</div>
      <div className="text-xl text-black mb-4">{`${heater.energyStarPartner} ${heater.modelName} Water Heater`}</div>
      <div className="text-xs text-gray-300 font-thin mb-4">
        {`Model Number: ${heater.modelNumber}`}
      </div>
      <div className="text-lg font-thin text-standard-green mb-2">
        Upfront Cost
      </div>
      <div className="text-xl mb-4">
        {`${displayDollar(heater.costInCentsAfterCredits)}`}
        <span className="ml-2 text-sm">{`with tax credits applied`}</span>
      </div>
      <div className="text-lg font-thin text-standard-green mb-2">
        Annual water heater energy cost savings
      </div>
      <div className="text-xl mb-4">
        {`Save ${displayDollar(heater.annualSavingsInCents)}`}
        <span className="ml-2 text-sm">{`/ year`}</span>
      </div>
      <div className="text-lg font-thin text-standard-green mb-2">
        {`Why you'll love it`}
      </div>
      <Reasons recommendationType={recType} heater={heater} />
    </div>
  );
};

const HeaterCardInfo = ({ heater }: { heater: HeaterInfoSchemaType }) => {};

const Reasons = ({
  recommendationType,
  heater,
}: {
  recommendationType: number;
  heater: HeaterInfoSchemaType;
}) => {
  const taxCreditSavingsInCents =
    heater.upfrontCostInCents - heater.costInCentsAfterCredits;
  const tenYearSavings = heater.annualSavingsInCents * 10;
  switch (recommendationType) {
    case RECOMMENDATION_TYPE.BEST_VALUE_TODAY:
      return (
        <ul className="list-disc ml-6 mt-2 ">
          <li className="pt-2">
            <div className="text-lg">Eligible for federal tax credits</div>
            <div className="text-sm">
              {`Save over ${displayDollar(taxCreditSavingsInCents)} upfront by using eligible tax credits`}
            </div>
          </li>
          <li className="pt-2">
            <div className="text-lg">
              Low installation costs with no big changes needed{" "}
            </div>
            <div className="text-sm">Save over $500</div>
          </li>
        </ul>
      );
    case RECOMMENDATION_TYPE.OUR_RECOMMENDATION:
      return (
        <ul className="list-disc ml-6 mt-2 ">
          <li className="pt-2">
            <div className="text-lg">
              This water heater will more than pay for itself
            </div>
            <div className="text-sm">{`Over ten years, you'll save ${displayDollar(tenYearSavings)}`}</div>
          </li>
          <li className="pt-2">
            <div className="text-lg">Eligible for federal tax credits</div>
            <div className="text-sm">
              {`Save over ${displayDollar(taxCreditSavingsInCents)} upfront by using eligible tax credits`}
            </div>
          </li>
        </ul>
      );
    case RECOMMENDATION_TYPE.ECO_FRIENDLY:
      return (
        <ul className="list-disc ml-6 mt-2 ">
          <li className="pt-2">
            <div className="text-lg">Eligible for federal tax credits</div>
            <div className="text-sm">
              {`Save over ${displayDollar(taxCreditSavingsInCents)} upfront by using eligible tax credits`}
            </div>
          </li>
          <li className="pt-2">
            <div className="text-lg">
              Low installation costs with no big changes needed{" "}
            </div>
            <div className="text-sm">Save over $500</div>
          </li>
        </ul>
      );
    default:
      return <></>;
  }
};
