"use client";
import EnergyTypesQuestion from "@/components/EnergyTypesQuestion";
import HouseholdSizeQuestion from "@/components/HouseholdSizeQuestion";
import ZipCodeQuestion from "@/components/ZipCodeQuestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@material-tailwind/react";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "net";
import { useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export const HouseholdSizeEnumSchema = z.enum(["1-2", "2-4", "5-6", "7+"]);
export const EnergyTypeEnumSchema = z.enum([
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

export type HouseholdSizeEnum = z.infer<typeof HouseholdSizeEnumSchema>;
export type EnergyTypeEnum = z.infer<typeof EnergyTypeEnumSchema>;
type PropaneVentEnumSchema = z.infer<typeof PropaneVentEnumSchema>;

const ApplianceFinderSchema = z.object({
  zipcode: z.string().min(5).max(5),
  householdSize: HouseholdSizeEnumSchema.nullable(),
  supportedEnergyTypes: z.array(EnergyTypeEnumSchema),
  ventType: PropaneVentEnumSchema.nullable(),
});

type ApplianceFinder = z.infer<typeof ApplianceFinderSchema>;

export default function ApplianceFinder() {
  const methods = useForm<ApplianceFinder>({
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

  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [currentExtraQuestion, setCurrentExtraQuestion] = useState<
    string | null
  >(null);

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
      setQuestionIdx(questionNumber);
    }
  };

  const moveToNextQuestion = () => {
    if (questionIdx + 1 < questions.length) {
      const nextQuestion = questions[questionIdx + 1];
      nextQuestion.current?.scrollIntoView({
        behavior: "smooth",
      });
      setQuestionIdx(questionIdx + 1);
    }
  };

  const moveToPreviousQuestion = () => {
    console.log("move to prev question");
    if (questionIdx - 1 >= 0) {
      const prevQuestion = questions[questionIdx - 1];
      prevQuestion.current?.scrollIntoView({
        behavior: "smooth",
      });
      setQuestionIdx(questionIdx - 1);
    }
  };

  return (
    <main className="bg-gray-600 ">
      <div className="flex">
        <div className="lg:bg-gray-600 lg:min-w-[1500px]" />
        <div className="p-8 lg:p-16 bg-gray-200 min-h-screen grow ">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div ref={question1Ref}>
                <ZipCodeQuestion
                  moveToNextQuestion={moveToNextQuestion}
                ></ZipCodeQuestion>
              </div>
              <div id="question2" ref={question2Ref}>
                <HouseholdSizeQuestion
                  moveToNextQuestion={moveToNextQuestion}
                  moveToPreviousQuestion={moveToPreviousQuestion}
                ></HouseholdSizeQuestion>
              </div>
              <div id="question3" ref={question3Ref}>
                <EnergyTypesQuestion
                  moveToNextQuestion={moveToNextQuestion}
                  moveToPreviousQuestion={moveToPreviousQuestion}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </main>
  );
}
