import { EnergyTypeEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";

export default function EnergyTypesQuestion({
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

  const supportedEnergyTypes: EnergyTypeEnum[] = watch("supportedEnergyTypes");

  // Sets the form input for energyType by toggling its presence in the list
  const toggleEnergyType = (energyType: EnergyTypeEnum) => {
    const idx = supportedEnergyTypes.indexOf(energyType);
    if (idx > -1) {
      const withValueRemoved = supportedEnergyTypes.filter(
        (elem) => elem !== energyType,
      );
      setValue("supportedEnergyTypes", withValueRemoved);
    } else {
      setValue("supportedEnergyTypes", [...supportedEnergyTypes, energyType]);
    }
  };

  return (
    <div
      id="question3"
      className="flex flex-col justify-center gap-8 min-h-screen"
    >
      <div className="flex text-3xl lg:text-4xl font-bold text-gray-600">
        What types of energy does your house have? (Select all)
      </div>
      <div className="flex flex-col text-3xl font-semibold text-gray-600">
        <div className="w-full lg:w-1/3 h-full">
          <Controller
            name="supportedEnergyTypes"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-around gap-4 p-4 ">
                <Button
                  onClick={() => toggleEnergyType("Electricity")}
                  placeholder="Electricity"
                  className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Electricity") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Electricity
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Natural Gas")}
                  placeholder="Natural Gas"
                  className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Natural Gas") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Natural Gas
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Propane")}
                  placeholder="Propane"
                  className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Propane") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Propane
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Solar Panels")}
                  placeholder="Solar Panels"
                  className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Solar Panels") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Solar Panels
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Other")}
                  placeholder="7+"
                  className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Other") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Other
                </Button>
              </div>
            )}
          />
        </div>
      </div>
      <div className="flex gap-4 lg:w-1/3 justify-center">
        <div className="">
          <Button
            variant="filled"
            placeholder="something"
            onClick={() => moveToPreviousQuestion()}
            className={`h-12 w-full bg-white text-gray-800 p-4`}
          >
            Go Back
          </Button>
        </div>
        <div className="">
          <Button
            variant="filled"
            placeholder="something"
            onClick={() => moveToNextQuestion()}
            disabled={getFieldState("supportedEnergyTypes").invalid}
            className={`h-12 w-full bg-white text-gray-800 p-4 ${getFieldState("supportedEnergyTypes").invalid ? "hover:cursor-not-allowed" : ""}`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
