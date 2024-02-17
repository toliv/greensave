import { ElectricitySupplyEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";

export default function ({
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
    <div
      id="question4"
      className="flex flex-col justify-center gap-8 min-h-screen mt-6"
    >
      <div className="flex p-4 text-2xl justify-center text-center font-bold text-gray-600">
        If you have an electric water heater today, which type of power outlet
        does it use ?
      </div>
      <div className="flex flex-col text-xl font-semibold text-gray-600">
        <div className="w-full h-full">
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
                  120V (standard 3-prong)
                </Button>
                <Button
                  onClick={() => handleElectricityChoice("LargerVoltage")}
                  placeholder="LargerVoltage"
                  className={`py-4 hover:shadow-xl ${supportedEnergySupply === "LargerVoltage" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Larger outlet with more than 3 prongs (e.g. 240V)
                </Button>
                <Button
                  onClick={() => handleElectricityChoice("Unknown")}
                  placeholder="Propane"
                  className={`py-4 hover:shadow-xl ${supportedEnergySupply === "Unknown" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  I don't know / I don't have an electric water heater
                </Button>
              </div>
            )}
          />
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <div className="">
          <Button
            variant="filled"
            placeholder="something"
            onClick={() => moveToPreviousQuestion()}
            className={`h-14 w-full bg-white text-gray-800 p-4`}
          >
            Back
          </Button>
        </div>
        <div className="">
          <Button
            variant="filled"
            placeholder="something"
            onClick={() => moveToNextQuestion()}
            disabled={getFieldState("supportedEnergySupply").invalid}
            className={`h-14 w-full bg-white text-gray-800 p-4 ${getFieldState("supportedEnergySupply").invalid ? "hover:cursor-not-allowed" : ""}`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
