import { Button, Input } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";
import { Question } from "./Question";

export function ZipCodeQuestion({
  moveToNextQuestion,
  moveToPreviousQuestion,
  submitIsLoading,
}: {
  moveToNextQuestion: any;
  moveToPreviousQuestion: any;
  submitIsLoading: boolean;
}) {
  const {
    control,
    formState: { errors },
    getFieldState,
  } = useFormContext();

  return (
    <div className="flex flex-col">
      {/* hack */}
      <div className="h-20"></div>
      <div>
        <Question
          moveToNextQuestion={moveToNextQuestion}
          moveToPreviousQuestion={moveToPreviousQuestion}
          moveToNextQuestionEnabled={() => !getFieldState("zipcode").invalid}
          questionHeading={`What is your zip code?`}
          questionSubheading={`This will help us localize your results`}
          isLastQuestion={true}
          submitIsLoading={submitIsLoading}
        >
          <Controller
            name="zipcode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                crossOrigin=""
                variant="outlined"
                size="lg"
                placeholder="Enter zipcode"
                autoComplete="off"
                className={`text-black font-thin rounded-lg p-4 text-center border-1 ${errors.zipcode ? "border-rose-500" : ""} shadow-md `}
                error={errors.zipcode ? true : false}
              />
            )}
          />
        </Question>
      </div>
    </div>
  );
}
