import { displayDollar } from "@/app/utils/displayDollar";
import { HeaterRecommendationType } from "@/schema/heaterRecommendations";
import * as React from "react";

interface HeaterEmailCardProps {
  heater: HeaterRecommendationType;
}

export const HeaterEmailCard: React.FC<Readonly<HeaterEmailCardProps>> = ({
  heater,
}: {
  heater: HeaterRecommendationType;
}) => {
  const taxCreditSavingsInCents =
    heater.upfrontCostInCents - heater.costInCentsAfterCredits;
  const tenYearSavings = heater.annualSavingsInCents * 10;
  return (
    <div className={`flex-1 border-1 rounded-md m-2 p-4 shadow-md`}>
      <div className="text-3xl text-standard-green mb-4">{`Your Saved Heater!`}</div>
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
      <ul className="list-disc ml-6 mt-2 ">
        <li className="pt-2">
          <div className="text-lg">Eligible for federal tax credits</div>
          <div className="text-sm">
            {`Save over ${displayDollar(taxCreditSavingsInCents)} upfront by using eligible tax credits`}
          </div>
        </li>
        <li className="pt-2">
          <div className="text-lg">Over 10 years save</div>
          <div className="text-sm">{`Over ten years, you'll save ${displayDollar(tenYearSavings)}`}</div>
        </li>
      </ul>
    </div>
  );
};
