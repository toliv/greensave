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
          questionHeading={`What types of energy are availabe in your house? (Select all)`}
          questionSubheading={`This will help us ensure that our recommendations can be easily installed in your home.`}
        >
          <Controller
            name="supportedEnergyTypes"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-around gap-4 py-4 text-xs font-sans font-thin ">
                <Button
                  onClick={() => toggleEnergyType("Electric")}
                  placeholder="Electricity"
                  className={`border-2 text-black py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Electric") ? " border-standard-green " : "bg-stone-50 border-transparent"}`}
                >
                  Electricity
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Natural Gas")}
                  placeholder="Natural Gas"
                  className={`border-2 text-black py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Natural Gas") ? " border-standard-green " : "bg-stone-50 border-transparent"}`}
                >
                  Natural Gas
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Propane")}
                  placeholder="Propane"
                  className={`border-2 text-black py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Propane") ? " border-standard-green " : "bg-stone-50 border-transparent"}`}
                >
                  Propane
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Solar Panels")}
                  placeholder="Solar Panels"
                  className={`border-2 text-black py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Solar Panels") ? " border-standard-green " : "bg-stone-50 border-transparent"}`}
                >
                  Solar Panels
                </Button>
                <Button
                  onClick={() => toggleEnergyType("Other")}
                  placeholder="7+"
                  className={`border-2 text-black py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Other") ? " border-standard-green " : "bg-stone-50 border-transparent"}`}
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
