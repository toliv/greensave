import { HouseholdSizeEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";
import { Question } from "./Question";

export function HouseholdSizeQuestion({
  moveToNextQuestion,
  moveToPreviousQuestion,
}: {
  moveToNextQuestion: () => void;
  moveToPreviousQuestion: () => void;
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
    <div className="flex flex-col">
      {/* hack */}
      <div className="h-20"></div>
      <div>
        <Question
          moveToNextQuestion={moveToNextQuestion}
          moveToNextQuestionEnabled={() =>
            !getFieldState("householdSize").invalid
          }
          questionHeading={`How many people live in your home?`}
          questionSubheading={`This will help us ensure that our recommendations can handle your expected usage.`}
        >
          <Controller
            name="householdSize"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-around gap-4 py-4 ">
                <Button
                  onClick={() => handleHouseholdSizeClick("1-2")}
                  placeholder="1-2"
                  className={`py-4 hover:shadow-xl ${householdSize === "1-2" ? "bg-green-500 text-white" : "bg-stone-50 text-black"}`}
                >
                  1 to 2 people
                </Button>
                <Button
                  onClick={() => handleHouseholdSizeClick("2-4")}
                  placeholder="2-4"
                  className={`py-4 hover:shadow-xl ${householdSize === "2-4" ? "bg-green-500 text-white" : "bg-stone-50 text-black"}`}
                >
                  2 to 4 people
                </Button>
                <Button
                  onClick={() => handleHouseholdSizeClick("5-6")}
                  placeholder="5-6"
                  className={`py-4 hover:shadow-xl ${householdSize === "5-6" ? "bg-green-500 text-white" : "bg-stone-50 text-black"}`}
                >
                  5 to 6 people
                </Button>
                <Button
                  onClick={() => handleHouseholdSizeClick("7+")}
                  placeholder="7+"
                  className={`py-4 hover:shadow-xl ${householdSize === "7+" ? "bg-green-500 text-white" : "bg-stone-50 text-black"}`}
                >
                  7+ people
                </Button>
              </div>
            )}
          />
        </Question>
      </div>
    </div>
  );
}
