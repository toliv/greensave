import { Controller, useFormContext } from "react-hook-form";
import { Question } from "./Question";
import Select, { StylesConfig } from "react-select";

export function HouseholdSizeQuestion({
  moveToNextQuestion,
  moveToPreviousQuestion,
}: {
  moveToNextQuestion: () => void;
  moveToPreviousQuestion: () => void;
}) {
  const {
    control,
    formState: { errors },
    getFieldState,
    setValue,
    watch,
  } = useFormContext();

  const handleHouseholdSizeClick = (choice: number) => {
    setValue("householdSize", choice);
  };

  const sizeOptions = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7+", value: 7 },
  ];

  const colourStyles: StylesConfig = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: "",
      };
    },
  };

  const householdSize = watch("householdSize");

  return (
    <div className="flex flex-col">
      {/* hack */}
      <div className="h-20"></div>
      <div>
        <Question
          moveToNextQuestion={moveToNextQuestion}
          moveToNextQuestionEnabled={() =>
            !getFieldState("householdSize").invalid
          }
          questionHeading={`How many people live in your home?`}
          questionSubheading={`This will help us ensure that our recommendations can handle your expected usage.`}
        >
          <Controller
            name="householdSize"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col justify-around gap-4 py-4 w-1/6 h-20 mb-32">
                <Select
                  options={sizeOptions}
                  value={sizeOptions.find((s) => s.value === householdSize)}
                  onChange={(s) => {
                    if (s) {
                      handleHouseholdSizeClick(s.value);
                    }
                  }}
                  instanceId={"123"}
                  styles={{
                    input: (base) => ({
                      ...base,
                      color: "black",
                    }),
                    option: (provided, { isFocused, isSelected }) => ({
                      ...provided,
                      color: "black",
                      backgroundColor: isFocused ? "green" : "white",
                    }),
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: "green",
                    }),
                  }}
                ></Select>
              </div>
            )}
          />
        </Question>
      </div>
    </div>
  );
}
