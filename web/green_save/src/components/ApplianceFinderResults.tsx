"use client";
import { displayDollar } from "@/app/utils/displayDollar";
import { trpc } from "@/app/_trpc/client";
import {
  HeaterInfoSchemaType,
  HeaterRecommendationsSchemaType,
  HeaterRecommendationType,
} from "@/schema/heaterRecommendations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, Input, Spinner } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export function ApplianceFinderResults({
  id,
  data,
}: {
  id: string;
  data: HeaterRecommendationsSchemaType;
}) {
  const router = useRouter();
  // const { id } = params;
  // const { data } = trpc.getRecommendedHeaters.useQuery({ id });
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <div className="w-full">
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
              <div className=" text-sm">
                <Button
                  type={"submit"}
                  variant="filled"
                  placeholder="something"
                  onClick={() => {}}
                  disabled={false}
                  className={`h-14 text-black px-12 ${formState.isValid && !emailMutationFn.isPending ? "bg-standard-green hover:cursor-pointer" : "bg-slate-300 hover:cursor-not-allowed"}`}
                >
                  {emailMutationFn.isPending ? (
                    <div className="flex px-4 justify-center gap-4">
                      <div>
                        <Spinner className="h-4 w-4 text-gray-100/50" />
                      </div>
                      <div>Loading ..</div>
                    </div>
                  ) : (
                    "Submit"
                  )}
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
  heater: HeaterRecommendationType;
  title: string;
  selected: boolean;
  setSelected: () => void;
  recType: number;
}) => {
  return (
    <div
      className={`flex-1 border-1 rounded-md m-2 p-4 shadow-md hover:cursor-pointer ${selected ? "bg-gray-100 shadow-lg border-standard-green" : "bg-white border-black"}`}
      onClick={setSelected}
    >
      <div className="text-3xl text-standard-green mb-4">{title}</div>
      <div className="text-xl text-black mb-4">{`${heater.energyStarPartner} ${heater.modelName} Water Heater`}</div>
      <div className="text-xs text-gray-400 font-thin mb-2">
        {`Model Number: ${heater.modelNumber}`}
      </div>
      <div className="text-xs text-gray-400 font-thin mb-4">
        {`Runs on: ${heater.fuelType}`}
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
        {heater.tenYearSavingsInCents > 0
          ? `Why you'll love it`
          : "Why it's our recommendation"}
      </div>
      <Reasons recommendationType={recType} heater={heater} />
    </div>
  );
};

const Reasons = ({
  recommendationType,
  heater,
}: {
  recommendationType: number;
  heater: HeaterRecommendationType;
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
            <div className="text-lg">Low installation costs </div>
            <div className="text-sm">
              No major changes needed to your heating system
            </div>
          </li>
        </ul>
      );
    case RECOMMENDATION_TYPE.OUR_RECOMMENDATION:
      return (
        <ul className="list-disc ml-6 mt-2 ">
          <li className="pt-2">
            {heater.tenYearSavingsInCents > 0 ? (
              <>
                <div className="text-lg">
                  This water heater will more than pay for itself
                </div>
                <div className="text-sm">{`Over ten years, you'll save ${displayDollar(tenYearSavings)}`}</div>
              </>
            ) : (
              <>
                <div className="text-lg">
                  This water heater is the least expensive long-term option
                </div>
                <div className="text-sm">{`All water heaters with your setup will cost you more in annual energy bills than is average for your location`}</div>
              </>
            )}
          </li>
          <li className="pt-2">
            {heater.tenYearSavingsInCents > 0 ? (
              <>
                <div className="text-lg">Eligible for federal tax credits</div>
                <div className="text-sm">
                  {`Save over ${displayDollar(taxCreditSavingsInCents)} upfront by using eligible tax credits`}
                </div>
              </>
            ) : (
              <>
                <div className="text-lg">
                  Consider choosing different fuel and ventilation options
                </div>
                <div className="text-sm">
                  {`Water heaters with options you’ve chosen will cause you to spend more money on energy bills over the long-term`}
                </div>
              </>
            )}
          </li>
          <li className="pt-2">
            <div className="text-lg">Low installation costs </div>
            <div className="text-sm">
              No major changes needed to your heating system
            </div>
          </li>
        </ul>
      );
    case RECOMMENDATION_TYPE.ECO_FRIENDLY:
      return (
        <ul className="list-disc ml-6 mt-2 ">
          <li className="pt-2">
            <EcoFriendlyReason heaterType={heater.heaterType} />
          </li>
          <li className="pt-2">
            <div className="text-lg">{`Lower your monthly energy bill.`}</div>
            <div className="text-sm">{`Reduce your water heater energy spend by ${(heater.savingsRate * 100).toFixed(2) + "%"}`}</div>
          </li>
          <li className="pt-2">
            <div className="text-lg">Eligible for federal tax credits</div>
            <div className="text-sm">
              {`Save over ${displayDollar(taxCreditSavingsInCents)} upfront by using eligible tax credits`}
            </div>
          </li>
        </ul>
      );
    default:
      return <></>;
  }
};

const EcoFriendlyReason = ({ heaterType }: { heaterType: string }) => {
  if (
    heaterType === "Solar with Electric Backup" ||
    heaterType === "Solar with Gas Backup"
  ) {
    return (
      <>
        <div className="text-lg">{`Reduce your carbon footprint. `}</div>
        <div className="text-sm">{`This water heater uses solar energy to efficiently heat your water.`}</div>
      </>
    );
  } else if (heaterType === "Gas Tankless") {
    return (
      <>
        <div className="text-lg">{`Environmentally conscious water heater.`}</div>
        <div className="text-sm">{` This tankless water heater only heats water on demand, meaning zero energy waste.`}</div>
      </>
    );
  } else if (heaterType === "Hybrid/Electric Heat Pump") {
    return (
      <>
        <div className="text-lg">{`Reduce your carbon footprint`}</div>
        <div className="text-sm">{`This water heater generates a percentage of its heat from the air around it, reducing your reliance on fossil fuels`}</div>
      </>
    );
  } else {
    return (
      <>
        <div className="text-lg">{`Reduce your carbon footprint`}</div>
        <div className="text-sm">{`Reduce your carbon footprint. This water heater generates a percentage of its heat from the air around it, reducing your reliance on fossil fuels`}</div>
      </>
    );
  }
};
