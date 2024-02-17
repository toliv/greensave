import { HouseholdSizeEnum, PropaneVentEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";

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
    <div
      id="question2"
      className="flex flex-col justify-center gap-4 min-h-screen"
    >
      <div className="mt-12 flex justify-center text-lg xl:text-2xl font-bold text-gray-600 text-center">
        If you have a natural gas or propane water heater today, which type of
        vent does it have?
      </div>
      <div className="flex flex-col text-xs xl:text-3xl font-light text-gray-600 justify-center">
        <div className="w-full h-full">
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
            disabled={getFieldState("householdSize").invalid}
            className={`h-14 w-full bg-white text-gray-800 p-4 ${getFieldState("householdSize").invalid ? "hover:cursor-not-allowed" : ""}`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
