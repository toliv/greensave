"use client";
import { trpc } from "@/app/_trpc/client";
import { HeaterInfoSchemaType } from "@/schema/heaterRecommendations";
import { useState } from "react";

const RECOMMENDATION_TYPE = {
  BEST_VALUE_TODAY: 0,
  OUR_RECOMMENDATION: 1,
  ECO_FRIENDLY: 2,
};

export default function ApplianceFinderResults({
  params,
}: {
  params: { id: string };
}) {
  const [selectedOption, setSelectedOption] = useState<number>(
    RECOMMENDATION_TYPE.OUR_RECOMMENDATION,
  );

  let { id } = params;
  const { data } = trpc.getRecommendedHeaters.useQuery({ id });
  console.log(data);
  return (
    <div className="w-screen h-screen bg-white">
      <div className="text-black mt-20 p-4">
        <div className="border-2">
          {/* TODO: Suspense + wait for load */}
          {data && (
            <>
              <div className="flex flex-col md:flex-row p-2">
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
      <div className="text-4xl text-standard-green mb-12">{title}</div>
      <div className="text-xl text-black mb-4">{`${heater.energyStarPartner} ${heater.modelName} Water Heater`}</div>
      <div className="text-xs text-gray-300 font-thin mb-8">
        {`Model Number: ${heater.modelNumber}`}
      </div>
      <div className="text-lg font-thin text-standard-green mb-2">
        Upfront Cost
      </div>
      <div className="text-2xl mb-4">
        {`${displayDollar(heater.costInCentsAfterCredits)}`}
        <span className="ml-2 text-sm">{`with tax credits applied`}</span>
      </div>
      <div className="text-lg font-thin text-standard-green mb-2">
        Annual water heater energy cost savings
      </div>
      <div className="text-2xl mb-8">
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

const displayDollar = (valueInCents: number): string => {
  return `$${Math.round(valueInCents / 100).toLocaleString()}`;
};
