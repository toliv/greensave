import {
  PropaneVentEnum,
  WaterHeaterSpaceRestrictionsEnum,
} from "@/schema/questionsSchema";

// Reusable function to construct a filter for size restrictions
export const heaterVentFilter = (ventType: PropaneVentEnum) => {
  if (
    ventType === "Direct Vent" ||
    ventType === "Power Direct Vent" ||
    ventType === "Power Vent"
  ) {
    return { ventType: ventType };
  } else if (ventType === "Traditional Atmospheric Vent") {
    return { ventType: "" };
  }
  return {};
};
