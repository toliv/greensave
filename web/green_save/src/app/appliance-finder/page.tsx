"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@material-tailwind/react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const HouseholdSizeEnumSchema = z.enum(["1-2", "2-4", "5-6", "7+"]);

type HouseholdSizeEnum = z.infer<typeof HouseholdSizeEnumSchema>;

const ApplianceFinderSchema = z.object({
  zipcode: z.string().min(5).max(5),
  householdSize: HouseholdSizeEnumSchema.nullable(),
});

type ApplianceFinder = z.infer<typeof ApplianceFinderSchema>;

export default function ApplianceFinder() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<ApplianceFinder>({
    resolver: zodResolver(ApplianceFinderSchema),
    mode: "onBlur",
    defaultValues: {
      zipcode: "",
      householdSize: null,
    },
  });

  const onSubmit = () => {
    console.log("HELLO");
  };

  const householdSize = watch("householdSize");

  const ref = useRef<null | HTMLDivElement>(null);

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHouseholdSizeClick = (choice: HouseholdSizeEnum) => {
    setValue("householdSize", choice);
  };

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
              <div className="flex">
                <Button
                  variant="filled"
                  placeholder="something"
                  onClick={handleClick}
                >
                  Next
                </Button>
              </div>
            </div>
            <div
              id="question2"
              ref={ref}
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
                          className={` hover:shadow-xl ${householdSize === "1-2" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                        >
                          1-2
                        </Button>
                        <Button
                          onClick={() => handleHouseholdSizeClick("2-4")}
                          placeholder="2-4"
                          className={` hover:shadow-xl ${householdSize === "2-4" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                        >
                          2-4
                        </Button>
                        <Button
                          onClick={() => handleHouseholdSizeClick("5-6")}
                          placeholder="5-6"
                          className={` hover:shadow-xl ${householdSize === "5-6" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                        >
                          5-6
                        </Button>
                        <Button
                          onClick={() => handleHouseholdSizeClick("7+")}
                          placeholder="7+"
                          className={` hover:shadow-xl ${householdSize === "7+" ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                        >
                          7+
                        </Button>
                      </div>
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
