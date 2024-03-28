"use client";
import { EnergyTypesQuestion } from "@/components/EnergyTypesQuestion";
import { HouseholdSizeQuestion } from "@/components/HouseholdSizeQuestion";
import {
  ApplianceFinderType,
  ApplianceFinderSchema,
} from "@/schema/questionsSchema";
import { ZipCodeQuestion } from "@/components/ZipCodeQuestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PropaneVentQuestion } from "@/components/PropaneVentQuestion";
import { HeaterSizeQuestion } from "@/components/HeaterSizeQuestion";
import { trpc } from "../_trpc/client";
import { useRouter } from "next/navigation";

export default function ApplianceFinderForm() {
  const router = useRouter();
  const mutationFn = trpc.submitUserFormSubmission.useMutation({
    onError: (err) => {},
    onSuccess: (data) => {
      router.push(`/appliance-finder/results/${data.id}`);
    },
  });

  const methods = useForm<ApplianceFinderType>({
    resolver: zodResolver(ApplianceFinderSchema),
    mode: "all",
    defaultValues: {
      zipcode: "",
      householdSize: 1,
      supportedEnergyTypes: [],
      ventType: null,
      heaterSpaceRestrictions: [],
    },
  });

  const onSubmit: SubmitHandler<ApplianceFinderType> = (data) => {
    mutationFn.mutate(data);
  };

  const supportedEnergyTypes = methods.watch("supportedEnergyTypes");

  // Use state to track the current question we're on
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [propaneExtraQuestionEnabled, setPropaneExtraQuestionEnabled] =
    useState<boolean>(false);

  // Create a ref for each question so we can navigate between them
  const question1Ref = useRef<null | HTMLDivElement>(null);
  const question2Ref = useRef<null | HTMLDivElement>(null);
  const question4Ref = useRef<null | HTMLDivElement>(null);
  const question5Ref = useRef<null | HTMLDivElement>(null);

  const naturalGasHeaterQuestionRef = useRef<null | HTMLDivElement>(null);
  const electricitySetupQuestionRef = useRef<null | HTMLDivElement>(null);

  const [questionRefs, setQuestionRefs] = useState<
    MutableRefObject<HTMLDivElement | null>[]
  >([question1Ref, question2Ref, question4Ref, question5Ref]);

  useEffect(() => {
    // If the user selects a particular energy type, we may need to ask extra questions
    // Start by resetting the questions in case things have been unchecked
    const defaultQuestions = [
      question1Ref,
      question2Ref,
      question4Ref,
      question5Ref,
    ];
    const userHasGas =
      supportedEnergyTypes.includes("Natural Gas") ||
      supportedEnergyTypes.includes("Propane");
    const userHasElectricity = supportedEnergyTypes.includes("Electric");
    if (userHasGas && userHasElectricity) {
      setQuestionRefs([
        ...defaultQuestions,
        naturalGasHeaterQuestionRef,
        electricitySetupQuestionRef,
      ]);

      setQuestionRefs([
        question1Ref,
        question2Ref,
        naturalGasHeaterQuestionRef,
        question4Ref,
        question5Ref,
      ]);
      setPropaneExtraQuestionEnabled(true);
    } else if (userHasGas) {
      setQuestionRefs([
        question1Ref,
        question2Ref,
        naturalGasHeaterQuestionRef,
        question4Ref,
        question5Ref,
      ]);
      setPropaneExtraQuestionEnabled(true);
    } else if (userHasElectricity) {
      setQuestionRefs([...defaultQuestions, electricitySetupQuestionRef]);
      setPropaneExtraQuestionEnabled(false);
    } else {
      setQuestionRefs(defaultQuestions);
      setPropaneExtraQuestionEnabled(false);
    }
  }, [supportedEnergyTypes]);

  const moveToNextQuestion = () => {
    // Use this as a trigger to reconsider questions
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
    <div className="">
      <div className="h-screen">
        <main className="bg-white">
          <div className="p-8 lg:p-16 grow ">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div id="question1" ref={question1Ref}>
                  <HouseholdSizeQuestion
                    moveToNextQuestion={moveToNextQuestion}
                    moveToPreviousQuestion={moveToPreviousQuestion}
                  ></HouseholdSizeQuestion>
                </div>
                <div id="question2" ref={question2Ref}>
                  <EnergyTypesQuestion
                    moveToNextQuestion={moveToNextQuestion}
                    moveToPreviousQuestion={moveToPreviousQuestion}
                  />
                </div>
                {propaneExtraQuestionEnabled && (
                  <div
                    id="gas-heater-extra-question"
                    ref={naturalGasHeaterQuestionRef}
                  >
                    <PropaneVentQuestion
                      moveToNextQuestion={moveToNextQuestion}
                      moveToPreviousQuestion={moveToPreviousQuestion}
                    />
                  </div>
                )}
                <div id="heater-size-question" ref={question4Ref}>
                  <HeaterSizeQuestion
                    moveToNextQuestion={moveToNextQuestion}
                    moveToPreviousQuestion={moveToPreviousQuestion}
                  />
                </div>
                <div id="question5" ref={question5Ref}>
                  <ZipCodeQuestion
                    moveToNextQuestion={moveToNextQuestion}
                    moveToPreviousQuestion={moveToPreviousQuestion}
                  ></ZipCodeQuestion>
                </div>
              </form>
            </FormProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
