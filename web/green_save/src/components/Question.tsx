import { HouseholdSizeEnum } from "@/schema/questionsSchema";
import { Button } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";
import { string } from "zod";

export interface QuestionHeading {
  heading: string;
  subheading: string;
}

export function Question({
  moveToNextQuestion,
  moveToPreviousQuestion,
  questionHeading,
  children,
  moveToNextQuestionEnabled,
  questionId,
}: {
  moveToNextQuestion: any;
  moveToPreviousQuestion: any;
  questionHeading: QuestionHeading;
  children: React.ReactNode;
  moveToNextQuestionEnabled: () => boolean;
  questionId?: string;
}) {
  return (
    <div
      id={questionId}
      className="flex flex-col gap-8 min-h-screen mt-20 items-start w-full lg:w-2/3 text-center"
    >
      <div className="flex justify-center text-2xl lg:text-2xl font-thin text-black">
        {questionHeading.heading}
      </div>
      <div className="flex justify-center text-lg lg:text-xl font-thin text-black">
        {questionHeading.subheading}
      </div>
      <div className="w-full lg:w-1/2">
        <div className="flex flex-col text-3xl font-semibold text-black justify-center">
          <div className="">{children}</div>
        </div>
        <div className="flex gap-4 w-full justify-center mt-12">
          <div className="">
            {moveToPreviousQuestion && (
              <Button
                variant="filled"
                placeholder="something"
                onClick={() => moveToPreviousQuestion()}
                className={`h-14 w-full bg-white text-gray-800 p-4 `}
              >
                Next
              </Button>
            )}
            {moveToNextQuestion && (
              <Button
                variant="filled"
                placeholder="something"
                onClick={() => moveToNextQuestion()}
                disabled={!moveToNextQuestionEnabled}
                className={`h-14 w-full bg-white text-gray-800 p-4 ${!moveToNextQuestionEnabled ? "hover:cursor-not-allowed" : ""}`}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
