import { Button, Input } from "@material-tailwind/react";
import { Controller, useFormContext } from "react-hook-form";

export default function ZipCodeQuestion({
  moveToNextQuestion,
}: {
  moveToNextQuestion: any;
}) {
  const {
    control,
    formState: { errors },
    getFieldState,
  } = useFormContext();

  return (
    <div className="flex flex-col justify-center gap-8 min-h-screen ">
      <div className="flex text-3xl justify-center lg:text-4xl font-bold text-gray-600">
        What is your zip code?
      </div>
      <div className="flex flex-col text-3xl font-semibold text-gray-600">
        <div className="w-full h-full">
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
                className={`rounded-lg p-4 text-center border-1 ${errors.zipcode ? "border-rose-500" : ""} shadow-md `}
                error={errors.zipcode ? true : false}
              />
            )}
          />
        </div>
      </div>
      <div className="">
        <div className="flex items-center text-center">
          <Button
            variant="filled"
            placeholder="something"
            onClick={() => moveToNextQuestion()}
            disabled={getFieldState("zipcode").invalid}
            className={`h-12 w-full bg-white text-gray-800 p-4 ${getFieldState("zipcode").invalid ? "hover:cursor-not-allowed" : ""}`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
