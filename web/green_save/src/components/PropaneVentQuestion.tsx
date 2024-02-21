import { HouseholdSizeEnum, PropaneVentEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";
import { Question } from "./Question";

export function PropaneVentQuestion({
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

  const handleVentTypeClick = (choice: PropaneVentEnum) => {
    setValue("ventType", choice);
  };

  const ventType = watch("ventType");

  return (
    <div className="flex flex-col">
      {/* hack */}
      <div className="h-20"></div>
      <div>
        <Question
          moveToNextQuestion={moveToNextQuestion}
          moveToPreviousQuestion={moveToPreviousQuestion}
          moveToNextQuestionEnabled={() => !getFieldState("ventType").invalid}
          questionHeading={`If you have a gas water heater today, which type of vent does it have?`}
          questionSubheading={`This will help us help us keep installation costs down by using your existing electrical setup.`}
        >
          <Controller
            name="ventType"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-around gap-4 p-4 ">
                <Button
                  onClick={() =>
                    handleVentTypeClick("Traditional Atmospheric Vent")
                  }
                  placeholder="atmospheric"
                  className={`p-4 hover:shadow-xl ${ventType === "Traditional Atmospheric Vent" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-600"}`}
                >
                  Traditional Atomspheric Vent - Typically seen with{" "}
                  <b>one vertical, metallic duct</b> coming out of the top of
                  the water heater and exiting your home
                </Button>
                <Button
                  onClick={() => handleVentTypeClick("Direct Vent")}
                  placeholder="direct"
                  className={`p-4 hover:shadow-xl ${ventType === "Direct Vent" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-600"}`}
                >
                  Direct Vent - Typically seen with{" "}
                  <b>one or two horizontal, metallic ducts</b> coming out of the
                  top of the water heater and exiting your home
                </Button>
                <Button
                  onClick={() => handleVentTypeClick("Power Vent")}
                  placeholder="power"
                  className={`p-4 hover:shadow-xl ${ventType === "Power Vent" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-600"}`}
                >
                  Power Vent - Typically seen with a{" "}
                  <b>
                    fan on top of the water heater that leads into one PVC pipe
                  </b>
                </Button>
                <Button
                  onClick={() => handleVentTypeClick("Power Direct Vent")}
                  placeholder="power-direct"
                  className={`p-4 hover:shadow-xl ${ventType === "Power Direct Vent" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-600"}`}
                >
                  Power Direct Vent - Typically seen with a{" "}
                  <b>
                    fan on top of the water heater that leads into two PVC pipes
                  </b>
                </Button>
                <Button
                  onClick={() => handleVentTypeClick("Unknown/Other")}
                  placeholder="unknown"
                  className={`p-4 hover:shadow-xl ${ventType === "Unknown/Other" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  {`I don't know / I don't have this type of water heater.`}
                </Button>
              </div>
            )}
          />
        </Question>
      </div>
    </div>
  );
}
