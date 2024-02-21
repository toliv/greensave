import { EnergyTypeEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";
import { Question } from "./Question";

export function EnergyTypesQuestion({
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
    <div className="flex flex-col">
      {/* hack */}
      <div className="h-20"></div>
      <div>
        <Question
          moveToNextQuestion={moveToNextQuestion}
          moveToPreviousQuestion={moveToPreviousQuestion}
          moveToNextQuestionEnabled={() =>
            !getFieldState("supportedEnergyTypes").invalid
          }
          questionHeading={`What types of energy does your house have? (Select all)`}
          questionSubheading={`This will help us ensure that our recommendations can handle your expected fuel type.`}
        >
          <Controller
            name="supportedEnergyTypes"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-around gap-4 py-4 ">
                <Button
                  onClick={() => toggleEnergyType("Electricity")}
                  placeholder="Electricity"
                  className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Electricity") ? "bg-standard-green text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Electricity
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Natural Gas")}
                  placeholder="Natural Gas"
                  className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Natural Gas") ? "bg-standard-green text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Natural Gas
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Propane")}
                  placeholder="Propane"
                  className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Propane") ? "bg-standard-green text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Propane
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Solar Panels")}
                  placeholder="Solar Panels"
                  className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Solar Panels") ? "bg-standard-green text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Solar Panels
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Other")}
                  placeholder="7+"
                  className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Other") ? "bg-standard-green text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  Other
                </Button>
              </div>
            )}
          />
        </Question>
      </div>
    </div>
  );
}
