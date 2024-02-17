import { WaterHeaterSpaceRestrictionsEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";

export default function HeaterSizeQuestion({
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
    <div
      id="question2"
      className="flex flex-col justify-center gap-4 min-h-screen"
    >
      <div className="mt-12 flex justify-center text-lg xl:text-2xl font-bold text-gray-600 text-center">
        Are there any size constraints in the space designated for your water
        heater?
      </div>
      <div className="flex flex-col text-xs xl:text-3xl font-light text-gray-600 justify-center">
        <div className="w-full h-full">
          <Controller
            name="tank-size-restrictions"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-around gap-4 p-4 ">
                <Button
                  onClick={() => handleSpaceRestrictionsClick(["NONE"])}
                  placeholder="none"
                  className={`p-4 hover:shadow-xl ${spaceRestrictions.includes("NONE") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-600"}`}
                >
                  My space has no size restrictions
                </Button>
                <Button
                  onClick={() => handleSpaceRestrictionsClick(["LOW_CEILINGS"])}
                  placeholder="low-ceilings"
                  className={`p-4 hover:shadow-xl ${spaceRestrictions.includes("LOW_CEILINGS") && spaceRestrictions.length === 1 ? "bg-green-500 text-white" : "bg-gray-50 text-gray-600"}`}
                >
                  {`My space has low ceilings (<6 feet)`}
                </Button>
                <Button
                  onClick={() => handleSpaceRestrictionsClick(["NARROW_WIDTH"])}
                  placeholder="narrow-width"
                  className={`p-4 hover:shadow-xl ${spaceRestrictions.includes("NARROW_WIDTH") && spaceRestrictions.length === 1 ? "bg-green-500 text-white" : "bg-gray-50 text-gray-600"}`}
                >
                  {`My space has a narrow width (<3 feet)`}
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
                  className={`p-4 hover:shadow-xl ${spaceRestrictions.length === 2 ? "bg-green-500 text-white" : "bg-gray-50 text-gray-600"}`}
                >
                  {`My space has both low ceilings and a narrow width`}
                </Button>
              </div>
            )}
          />
        </div>
      </div>
      <div className="flex gap-4 w-full justify-center">
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
            disabled={getFieldState("spaceRestrictions").invalid}
            className={`h-14 w-full bg-white text-gray-800 p-4 ${getFieldState("spaceRestrictions").invalid ? "hover:cursor-not-allowed" : ""}`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
