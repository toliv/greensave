import { HouseholdSizeEnum } from "@/app/appliance-finder/page";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";

export default function HouseholdSizeQuestion({
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

  const handleHouseholdSizeClick = (choice: HouseholdSizeEnum) => {
    setValue("householdSize", choice);
  };

  const householdSize = watch("householdSize");

  return (
    <div
      id="question2"
      className="flex flex-col justify-center gap-8 min-h-screen"
    >
      <div className="flex text-3xl lg:text-4xl font-bold text-gray-600">
        How many people live in your house?
      </div>
      <div className="flex flex-col text-3xl font-semibold text-gray-600">
        <div className="w-full lg:w-1/3 h-full">
          <Controller
            name="householdSize"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-around gap-4 p-4 ">
                <Button
                  onClick={() => handleHouseholdSizeClick("1-2")}
                  placeholder="1-2"
                  className={`py-4 hover:shadow-xl ${householdSize === "1-2" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  1-2
                </Button>
                <Button
                  onClick={() => handleHouseholdSizeClick("2-4")}
                  placeholder="2-4"
                  className={`py-4 hover:shadow-xl ${householdSize === "2-4" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  2-4
                </Button>
                <Button
                  onClick={() => handleHouseholdSizeClick("5-6")}
                  placeholder="5-6"
                  className={`py-4 hover:shadow-xl ${householdSize === "5-6" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  5-6
                </Button>
                <Button
                  onClick={() => handleHouseholdSizeClick("7+")}
                  placeholder="7+"
                  className={`py-4 hover:shadow-xl ${householdSize === "7+" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                >
                  7+
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
            disabled={getFieldState("householdSize").invalid}
            className={`h-12 w-full bg-white text-gray-800 p-4 ${getFieldState("householdSize").invalid ? "hover:cursor-not-allowed" : ""}`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
