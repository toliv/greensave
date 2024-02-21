import { ElectricitySupplyEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";
import { Question } from "./Question";

export function ElectricitySupplyQuestion({
  moveToNextQuestion,
  moveToPreviousQuestion,
}: {
  moveToNextQuestion: any;
  moveToPreviousQuestion: any;
}) {
  const {
    control,
    formState: { errors },
    getFieldState,
    setValue,
    watch,
  } = useFormContext();

  const supportedEnergySupply: ElectricitySupplyEnum = watch(
    "supportedEnergySupply",
  );

  const handleElectricityChoice = (choice: ElectricitySupplyEnum) => {
    setValue("supportedEnergySupply", choice);
  };

  return (
    <div className="flex flex-col">
      {/* hack */}
      <div className="h-20"></div>
      <div>
        <Question
          moveToNextQuestion={moveToNextQuestion}
          moveToPreviousQuestion={moveToPreviousQuestion}
          moveToNextQuestionEnabled={() =>
            !getFieldState("householdSize").invalid
          }
          questionHeading={`If you have an electric water heater today, which type of power outlet does it use?`}
          questionSubheading={`This will help us keep installation costs down by using your existing electrical setup.`}
        >
          <Controller
            name="supportedEnergySupply"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-around gap-4 p-4 ">
                <Button
                  onClick={() => handleElectricityChoice("120V")}
                  placeholder="120V"
                  className={`py-4 hover:shadow-xl ${supportedEnergySupply === "120V" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  {`A standard 3 prong power outlet like I use for normal appliances`}
                </Button>
                <Button
                  onClick={() => handleElectricityChoice("LargerVoltage")}
                  placeholder="LargerVoltage"
                  className={`py-4 hover:shadow-xl ${supportedEnergySupply === "LargerVoltage" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  {`A special, larger power outlet that has more than 3 prongs`}
                </Button>
                <Button
                  onClick={() => handleElectricityChoice("Unknown")}
                  placeholder="Propane"
                  className={`py-4 hover:shadow-xl ${supportedEnergySupply === "Unknown" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  {`I don't know / I don't have an electric water heater`}
                </Button>
              </div>
            )}
          />
        </Question>
      </div>
    </div>
  );
}
