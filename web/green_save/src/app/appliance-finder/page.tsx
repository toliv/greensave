"use client";
import EnergyTypesQuestion from "@/components/EnergyTypesQuestion";
import HouseholdSizeQuestion from "@/components/HouseholdSizeQuestion";
import {
  ApplianceFinder,
  ApplianceFinderSchema,
} from "@/schema/questionsSchema";
import ZipCodeQuestion from "@/components/ZipCodeQuestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@material-tailwind/react";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "net";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

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

  const supportedEnergyTypes = methods.watch("supportedEnergyTypes");
  // console.log(supportedEnergyTypes);

  // Use state to track the current question we're on
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  // Create a ref for each question so we can navigate between them
  const question1Ref = useRef<null | HTMLDivElement>(null);
  const question2Ref = useRef<null | HTMLDivElement>(null);
  const question3Ref = useRef<null | HTMLDivElement>(null);
  const question4Ref = useRef<null | HTMLDivElement>(null);

  const naturalGasHeaterQuestionRef = useRef<null | HTMLDivElement>(null);
  const electricitySetupQuestionRef = useRef<null | HTMLDivElement>(null);

  const [questionRefs, setQuestionRefs] = useState<
    MutableRefObject<HTMLDivElement | null>[]
  >([question1Ref, question2Ref, question3Ref]);

  // by default
  useEffect(() => {
    console.log("CHANGING stuff");
    // If the user selects a particular energy type, we may need to ask extra questions
    // Start by resetting the questions in case things have been unchecked
    const defaultQuestions = [question1Ref, question2Ref, question3Ref];
    const userHasGas =
      supportedEnergyTypes.includes("Natural Gas") ||
      supportedEnergyTypes.includes("Propane");
    const userHasElectricity = supportedEnergyTypes.includes("Electricity");
    if (userHasGas && userHasElectricity) {
      setQuestionRefs([
        ...defaultQuestions,
        naturalGasHeaterQuestionRef,
        electricitySetupQuestionRef,
      ]);
    } else if (userHasGas) {
      setQuestionRefs([...defaultQuestions, naturalGasHeaterQuestionRef]);
    } else if (userHasElectricity) {
      setQuestionRefs([...defaultQuestions, electricitySetupQuestionRef]);
    }
    setQuestionRefs(defaultQuestions);
  }, [supportedEnergyTypes]);

  const moveToNextQuestion = () => {
    if (questionIdx + 1 < questionRefs.length) {
      const nextQuestion = questionRefs[questionIdx + 1];
      nextQuestion.current?.scrollIntoView({
        behavior: "smooth",
      });
      setQuestionIdx(questionIdx + 1);
    }
  };

  const moveToPreviousQuestion = () => {
    if (questionIdx - 1 >= 0) {
      const prevQuestion = questionRefs[questionIdx - 1];
      prevQuestion.current?.scrollIntoView({
        behavior: "smooth",
      });
      setQuestionIdx(questionIdx - 1);
    }
  };

  return (
    <main className="bg-gray-600 ">
      <div className="flex">
        <div className="lg:bg-gray-600 lg:min-w-[700px]" />
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
