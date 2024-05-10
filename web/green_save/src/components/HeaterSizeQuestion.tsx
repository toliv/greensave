import { WaterHeaterSpaceRestrictionsEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";
import { Question } from "./Question";

export function HeaterSizeQuestion({
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

  const handleSpaceRestrictionsClick = (
    choices: WaterHeaterSpaceRestrictionsEnum[],
  ) => {
    setValue("heaterSpaceRestrictions", choices);
  };

  const spaceRestrictions: WaterHeaterSpaceRestrictionsEnum[] = watch(
    "heaterSpaceRestrictions",
  );

  return (
    <div className="flex flex-col">
      {/* hack */}
      <div className="h-20"></div>
      <div>
        <Question
          moveToNextQuestion={moveToNextQuestion}
          moveToPreviousQuestion={moveToPreviousQuestion}
          moveToNextQuestionEnabled={() =>
            !getFieldState("heaterSpaceRestrictions").invalid
          }
          questionHeading={`Do you have any space constraints?`}
          questionSubheading={`This will help us ensure our recommendations can fit in your existing space.`}
        >
          <Controller
            name="tank-size-restrictions"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-around gap-4 py-4 font-thin ">
                <Button
                  onClick={() => handleSpaceRestrictionsClick(["NONE"])}
                  placeholder="none"
                  className={`p-4 hover:shadow-xl ${spaceRestrictions.includes("NONE") ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  {`No, my space is unconstrained (most common for basements)`}
                </Button>
                <Button
                  onClick={() => handleSpaceRestrictionsClick(["LOW_CEILINGS"])}
                  placeholder="low-ceilings"
                  className={`p-4 hover:shadow-xl ${spaceRestrictions.includes("LOW_CEILINGS") && spaceRestrictions.length === 1 ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  {`My space has low ceilings`}
                </Button>
                <Button
                  onClick={() => handleSpaceRestrictionsClick(["NARROW_WIDTH"])}
                  placeholder="narrow-width"
                  className={`p-4 hover:shadow-xl ${spaceRestrictions.includes("NARROW_WIDTH") && spaceRestrictions.length === 1 ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  {`My space has a narrow width`}
                </Button>
                <Button
                  onClick={() =>
                    handleSpaceRestrictionsClick([
                      "LOW_CEILINGS",
                      "NARROW_WIDTH",
                    ])
                  }
                  placeholder="power"
                  //   Assumptions baked in here w length, but tolerable for now
                  className={`p-4 hover:shadow-xl ${spaceRestrictions.length === 2 ? "bg-standard-green text-white" : "bg-stone-50 text-black"}`}
                >
                  {`My space has both low ceilings and a narrow width`}
                </Button>
              </div>
            )}
          />
        </Question>
      </div>
    </div>
  );
}
