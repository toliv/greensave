"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@material-tailwind/react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const ApplianceFinderSchema = z.object({
  zipcode: z.string().min(5).max(5),
});

export default function ApplianceFinder() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ApplianceFinderSchema),
    mode: "onBlur",
    defaultValues: {
      zipcode: "",
    },
  });

  const onSubmit = () => {
    console.log("HELLO");
  };

  const ref = useRef<null | HTMLDivElement>(null);

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const element = document.getElementById("question2");
  console.log(element);

  return (
    <main className="bg-gray-600 ">
      <div className="flex">
        <div className="lg:bg-gray-600 lg:min-w-[1500px]" />
        <div className="p-8 lg:p-16 bg-gray-200 min-h-screen grow ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col justify-center gap-8 min-h-screen">
              <div className="flex text-3xl lg:text-4xl font-bold text-gray-600">
                What is your zip code?
              </div>
              <div className="flex flex-col text-3xl font-semibold text-gray-600">
                <div className="w-full lg:w-1/3 h-full">
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
                        aria-errormessage={errors.zipcode?.message}
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <Button placeholder="something" onClick={handleClick}>
                  Button
                </Button>
              </div>
            </div>
            <div
              id="question2"
              ref={ref}
              className="flex flex-col justify-center gap-8 min-h-screen"
            >
              <div className="flex text-3xl lg:text-4xl font-bold text-gray-600">
                What is your other thing?
              </div>
              <div className="flex flex-col text-3xl font-semibold text-gray-600">
                <div className="w-full lg:w-1/3 h-full">
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
                        aria-errormessage={errors.zipcode?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
