import { Button } from "@material-tailwind/react";

export interface QuestionHeading {
  heading: string;
  subheading: string;
}

// Purpose of this component is to consolidate styling
export function Question({
  moveToNextQuestion,
  moveToPreviousQuestion,
  questionHeading,
  questionSubheading,
  moveToNextQuestionEnabled,
  questionId,
  children,
}: {
  moveToNextQuestion: () => void;
  moveToPreviousQuestion?: () => void;
  questionHeading: string;
  questionSubheading: string;
  moveToNextQuestionEnabled: () => boolean;
  questionId?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={questionId}
      className="flex flex-col gap-8 min-h-screen mt-20 items-start w-full text-left"
    >
      <div className="text-2xl lg:text-2xl font-ultralight text-black">
        {questionHeading}
      </div>
      <div className="text-lg lg:text-xl font-thin text-black">
        {questionSubheading}
      </div>
      <div className="w-full lg:w-1/2">
        <div className="flex flex-col justify-center">
          <div className="">{children}</div>
        </div>
        <div className="flex gap-4 w-full justify-around mt-12 ">
          {moveToPreviousQuestion && (
            <Button
              variant="filled"
              placeholder="something"
              onClick={() => moveToPreviousQuestion()}
              className={`h-14 w-1/3 bg-default-gray text-black p-4 `}
            >
              Back
            </Button>
          )}
          {moveToNextQuestion && (
            <Button
              variant="filled"
              placeholder="something"
              onClick={() => moveToNextQuestion()}
              disabled={!moveToNextQuestionEnabled()}
              className={`h-14 w-1/3 bg-standard-green text-black p-4 ${!moveToNextQuestionEnabled ? "hover:cursor-not-allowed" : ""}`}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
