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
              <div className="flex flex-col justify-around gap-4 py-4 ">
                <Button
                  onClick={() => handleElectricityChoice("120V")}
                  placeholder="120V"
                  className={`py-4 hover:shadow-xl ${supportedEnergySupply === "120V" ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  {`A standard 3 prong power outlet like I use for normal appliances`}
                </Button>
                <Button
                  onClick={() => handleElectricityChoice("LargerVoltage")}
                  placeholder="LargerVoltage"
                  className={`py-4 hover:shadow-xl ${supportedEnergySupply === "LargerVoltage" ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  {`A special, larger power outlet that has more than 3 prongs`}
                </Button>
                <Button
                  onClick={() => handleElectricityChoice("Unknown")}
                  placeholder="Propane"
                  className={`py-4 hover:shadow-xl ${supportedEnergySupply === "Unknown" ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
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
