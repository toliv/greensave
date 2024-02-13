"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@material-tailwind/react";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "net";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const HouseholdSizeEnumSchema = z.enum(["1-2", "2-4", "5-6", "7+"]);
const EnergyTypeEnumSchema = z.enum([
  "Electricity",
  "Natural Gas",
  "Propane",
  "Solar Panels",
  "Other",
]);
const PropaneVentEnumSchema = z.enum([
  "Traditional Atmospheric Vent",
  "Direct Vent",
  "Power Vent",
  "Power Direct Vent",
  "Unknown/Other",
]);

type HouseholdSizeEnum = z.infer<typeof HouseholdSizeEnumSchema>;
type EnergyTypeEnum = z.infer<typeof EnergyTypeEnumSchema>;
type PropaneVentEnumSchema = z.infer<typeof PropaneVentEnumSchema>;

const ApplianceFinderSchema = z.object({
  zipcode: z.string().min(5).max(5),
  householdSize: HouseholdSizeEnumSchema.nullable(),
  supportedEnergyTypes: z.array(EnergyTypeEnumSchema),
  ventType: PropaneVentEnumSchema.nullable(),
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
    getFieldState,
  } = useForm<ApplianceFinder>({
    resolver: zodResolver(ApplianceFinderSchema),
    mode: "all",
    defaultValues: {
      zipcode: "",
      householdSize: null,
      supportedEnergyTypes: [],
      ventType: null,
    },
  });

  const onSubmit = () => {
    console.log("HELLO");
  };

  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [currentExtraQuestion, setCurrentExtraQuestion] = useState<
    string | null
  >(null);

  const householdSize = watch("householdSize");
  const supportedEnergyTypes = watch("supportedEnergyTypes");

  const question1Ref = useRef<null | HTMLDivElement>(null);
  const question2Ref = useRef<null | HTMLDivElement>(null);
  const question3Ref = useRef<null | HTMLDivElement>(null);
  const propaneExtraQuestionRef = useRef<null | HTMLDivElement>(null);

  const question4Ref = useRef<null | HTMLDivElement>(null);

  const questions = [question1Ref, question2Ref, question3Ref];

  // Contains logic to move to the necessary question ref
  const moveToQuestion = (questionNumber: number) => {
    if (questionNumber >= 1 && questionNumber <= questions.length) {
      questions[questionNumber - 1].current?.scrollIntoView({
        behavior: "smooth",
      });
      setQuestionNumber(questionNumber);
    }
  };

  // Sets the form input for householdSize
  const handleHouseholdSizeClick = (choice: HouseholdSizeEnum) => {
    setValue("householdSize", choice);
  };

  // Sets the form input for energyType by toggling its presence in the list
  const toggleEnergyType = (energyType: EnergyTypeEnum) => {
    const idx = supportedEnergyTypes.indexOf(energyType);
    if (idx > -1) {
      const withValueRemoved = supportedEnergyTypes.filter(
        (elem) => elem !== energyType,
      );
      setValue("supportedEnergyTypes", withValueRemoved);
    } else {
      setValue("supportedEnergyTypes", [...supportedEnergyTypes, energyType]);
    }
  };

  return (
    <main className="bg-gray-600 ">
      <div className="flex">
        <div className="lg:bg-gray-600 lg:min-w-[1500px]" />
        <div className="p-8 lg:p-16 bg-gray-200 min-h-screen grow ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              ref={question1Ref}
              className="flex flex-col justify-center gap-8 min-h-screen "
            >
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
              <div className="w-1/3">
                <div className="flex items-center text-center">
                  <Button
                    variant="filled"
                    placeholder="something"
                    onClick={() => moveToQuestion(2)}
                    disabled={getFieldState("zipcode").invalid}
                    className={`h-12 w-full bg-white text-gray-800 p-4 ${getFieldState("zipcode").invalid ? "hover:cursor-not-allowed" : ""}`}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
            <div
              id="question2"
              ref={question2Ref}
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
                    onClick={() => moveToQuestion(1)}
                    className={`h-12 w-full bg-white text-gray-800 p-4`}
                  >
                    Go Back
                  </Button>
                </div>
                <div className="">
                  <Button
                    variant="filled"
                    placeholder="something"
                    onClick={() => moveToQuestion(3)}
                    disabled={getFieldState("householdSize").invalid}
                    className={`h-12 w-full bg-white text-gray-800 p-4 ${getFieldState("householdSize").invalid ? "hover:cursor-not-allowed" : ""}`}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
            <div
              id="question3"
              ref={question3Ref}
              className="flex flex-col justify-center gap-8 min-h-screen"
            >
              <div className="flex text-3xl lg:text-4xl font-bold text-gray-600">
                What types of energy does your house have? (Select all)
              </div>
              <div className="flex flex-col text-3xl font-semibold text-gray-600">
                <div className="w-full lg:w-1/3 h-full">
                  <Controller
                    name="supportedEnergyTypes"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col justify-around gap-4 p-4 ">
                        <Button
                          onClick={() => toggleEnergyType("Electricity")}
                          placeholder="Electricity"
                          className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Electricity") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                        >
                          Electricity
                        </Button>
                        <Button
                          onClick={() => toggleEnergyType("Natural Gas")}
                          placeholder="Natural Gas"
                          className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Natural Gas") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                        >
                          Natural Gas
                        </Button>
                        <Button
                          onClick={() => toggleEnergyType("Propane")}
                          placeholder="Propane"
                          className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Propane") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                        >
                          Propane
                        </Button>
                        <Button
                          onClick={() => toggleEnergyType("Solar Panels")}
                          placeholder="Solar Panels"
                          className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Solar Panels") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                        >
                          Solar Panels
                        </Button>
                        <Button
                          onClick={() => toggleEnergyType("Other")}
                          placeholder="7+"
                          className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Other") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                        >
                          Other
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
                    onClick={() => moveToQuestion(2)}
                    className={`h-12 w-full bg-white text-gray-800 p-4`}
                  >
                    Go Back
                  </Button>
                </div>
                <div className="">
                  <Button
                    variant="filled"
                    placeholder="something"
                    onClick={() => moveToQuestion(4)}
                    disabled={getFieldState("supportedEnergyTypes").invalid}
                    className={`h-12 w-full bg-white text-gray-800 p-4 ${getFieldState("supportedEnergyTypes").invalid ? "hover:cursor-not-allowed" : ""}`}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
            {supportedEnergyTypes.includes("Propane") && (
              <div
                id="propaneExtraQuestion"
                ref={propaneExtraQuestionRef}
                className="flex flex-col justify-center gap-8 min-h-screen"
              >
                <div className="flex text-3xl lg:text-4xl font-bold text-gray-600">
                  What types of energy does your house have? (Select all)
                </div>
                <div className="flex flex-col text-3xl font-semibold text-gray-600">
                  <div className="w-full lg:w-1/3 h-full">
                    <Controller
                      name="supportedEnergyTypes"
                      control={control}
                      render={({ field }) => (
                        <div className="flex flex-col justify-around gap-4 p-4 ">
                          <Button
                            onClick={() => toggleEnergyType("Electricity")}
                            placeholder="Electricity"
                            className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Electricity") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                          >
                            Electricity
                          </Button>
                          <Button
                            onClick={() => toggleEnergyType("Natural Gas")}
                            placeholder="Natural Gas"
                            className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Natural Gas") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                          >
                            Natural Gas
                          </Button>
                          <Button
                            onClick={() => toggleEnergyType("Propane")}
                            placeholder="Propane"
                            className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Propane") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                          >
                            Propane
                          </Button>
                          <Button
                            onClick={() => toggleEnergyType("Solar Panels")}
                            placeholder="Solar Panels"
                            className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Solar Panels") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                          >
                            Solar Panels
                          </Button>
                          <Button
                            onClick={() => toggleEnergyType("Other")}
                            placeholder="7+"
                            className={`py-4 hover:shadow-xl ${supportedEnergyTypes.includes("Other") ? "bg-green-500 text-white" : "bg-gray-50 text-gray-700"}`}
                          >
                            Other
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
                      onClick={() => moveToQuestion(2)}
                      className={`h-12 w-full bg-white text-gray-800 p-4`}
                    >
                      Go Back
                    </Button>
                  </div>
                  <div className="">
                    <Button
                      variant="filled"
                      placeholder="something"
                      onClick={() => moveToQuestion(4)}
                      disabled={getFieldState("supportedEnergyTypes").invalid}
                      className={`h-12 w-full bg-white text-gray-800 p-4 ${getFieldState("supportedEnergyTypes").invalid ? "hover:cursor-not-allowed" : ""}`}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
