import { HouseholdSizeEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";

export function HouseholdSizeQuestion({
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
      className="flex flex-col gap-8 min-h-screen mt-20 items-start w-full lg:w-2/3 text-center"
    >
      <div className="flex justify-center text-2xl lg:text-2xl font-thin text-black">
        How many people live in your house?
      </div>
      <div className="flex justify-center text-lg lg:text-xl font-thin text-black">
        This will help us ensure that our recommendations can handle your
        expected usage.
      </div>
      <div className="w-full lg:w-1/2">
        <div className="flex flex-col text-3xl font-semibold text-black justify-center">
          <div className="">
            <Controller
              name="householdSize"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col justify-around gap-4 py-4 ">
                  <Button
                    onClick={() => handleHouseholdSizeClick("1-2")}
                    placeholder="1-2"
                    className={`py-4 hover:shadow-xl ${householdSize === "1-2" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                  >
                    1 to 2 people
                  </Button>
                  <Button
                    onClick={() => handleHouseholdSizeClick("2-4")}
                    placeholder="2-4"
                    className={`py-4 hover:shadow-xl ${householdSize === "2-4" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                  >
                    2 to 4 people
                  </Button>
                  <Button
                    onClick={() => handleHouseholdSizeClick("5-6")}
                    placeholder="5-6"
                    className={`py-4 hover:shadow-xl ${householdSize === "5-6" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                  >
                    5 to 6 people
                  </Button>
                  <Button
                    onClick={() => handleHouseholdSizeClick("7+")}
                    placeholder="7+"
                    className={`py-4 hover:shadow-xl ${householdSize === "7+" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                  >
                    7+ people
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex gap-4 w-full justify-center mt-12">
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
    </div>
  );
}
