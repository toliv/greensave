import { WaterHeaterSpaceRestrictionsEnum } from "@/schema/questionsSchema";

// Reusable function to construct a filter for size restrictions
export const sizeRestrictionsFilter = (
  sizeRestrictions: WaterHeaterSpaceRestrictionsEnum[],
) => {
  let sizeRestrictionsQuery = {};
  if (sizeRestrictions.includes("LOW_CEILINGS")) {
    const filterForHeight = {
      OR: [
        {
          tankHeightInches: { lte: 50 },
        },
        {
          tankHeightInches: null,
        },
      ],
    };
    sizeRestrictionsQuery = { ...sizeRestrictionsQuery, ...filterForHeight };
  }
  if (sizeRestrictions.includes("NARROW_WIDTH")) {
    const filterForDiameter = {
      OR: [
        {
          tankDiameterInches: { lte: 24 },
        },
        {
          tankDiameterInches: null,
        },
      ],
    };
    sizeRestrictionsQuery = { ...sizeRestrictionsQuery, ...filterForDiameter };
  }
  return sizeRestrictionsQuery;
};
