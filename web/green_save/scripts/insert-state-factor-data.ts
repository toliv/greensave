import { PrismaClient, StateInputFactor } from "@prisma/client";
import fetch from "node-fetch";
import Papa from "papaparse";
import { convertDollarStrToCents } from "./utils";

const prisma = new PrismaClient();

export const main = async () => {
  const sheetId = "16c60NhScFhAfgdmvZrknL_LBrROoMwbL";
  const gid = "569184641";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok.");
    const csvData = await response.text();
    const result = await Papa.parse(csvData, {
      header: true,
      delimiter: ",",
    });
    const rows = result.data;
    const recordsToInsert: Omit<StateInputFactor, "id">[] = rows.map(
      (row: any) => {
        return {
          state: row["State"],
          groundwaterTemperature: parseInt(row["Groundwater Temperature"]),
          averageWinterTemperature: parseInt(row["Average Winter Temperature"]),
          solarTankVolumeFactor: parseFloat(row["Solar Tank Volume Factor"]),
          monthlyElectricityBillCents:
            row["Electricity Monthly Bills"] !== "N / A"
              ? convertDollarStrToCents(row["Electricity Monthly Bills"])
              : null,
          monthlyGasBillCents:
            row["Gas Monthly Bills"] !== "N / A"
              ? convertDollarStrToCents(row["Gas Monthly Bills"])
              : null,
          electricityPriceCentsPerKwh: convertDollarStrToCents(
            row["Electricity Price (Cents per KWh)"],
          ),
          gasPricePerThousandCubicFeetCents: convertDollarStrToCents(
            row["Gas Price (Dollars per Thousand Cubic Feet)"],
          ),
          propanePricePerGallonCents: convertDollarStrToCents(
            row["Propane Price (Dollars per Gallon)"],
          ),
        };
      },
    );
    // Delete everything
    await prisma.stateInputFactor.deleteMany({});
    // Insert everything
    await prisma.stateInputFactor.createMany({
      data: recordsToInsert,
    });
    const ct = await prisma.stateInputFactor.count();
    console.log(`${ct} records inserted`);
  } catch (error) {
    console.error("Failed to download the sheet:", error);
  }
};

main();
