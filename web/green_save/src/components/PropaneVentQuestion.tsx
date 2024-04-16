import { PropaneVentEnum } from "@/schema/questionsSchema";
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
              <div className="flex flex-col justify-around gap-4 py-4 ">
                <Button
                  onClick={() =>
                    handleVentTypeClick("Traditional Atmospheric Vent")
                  }
                  placeholder="atmospheric"
                  className={`p-4 hover:shadow-xl ${ventType === "Traditional Atmospheric Vent" ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  Traditional Atomspheric Vent
                </Button>
                <Button
                  onClick={() => handleVentTypeClick("Direct Vent")}
                  placeholder="direct"
                  className={`p-4 hover:shadow-xl ${ventType === "Direct Vent" ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  Direct Vent
                </Button>
                <Button
                  onClick={() => handleVentTypeClick("Power Vent")}
                  placeholder="power"
                  className={`p-4 hover:shadow-xl ${ventType === "Power Vent" ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  Power Vent
                </Button>
                <Button
                  onClick={() => handleVentTypeClick("Power Direct Vent")}
                  placeholder="power-direct"
                  className={`p-4 hover:shadow-xl ${ventType === "Power Direct Vent" ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  Power Direct Vent
                </Button>
                <Button
                  onClick={() => handleVentTypeClick("Unknown/Other")}
                  placeholder="unknown"
                  className={`p-4 hover:shadow-xl ${ventType === "Unknown/Other" ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  {`I don't know / I don't have this type of water heater`}
                </Button>
              </div>
            )}
          />
        </Question>
      </div>
    </div>
  );
}
