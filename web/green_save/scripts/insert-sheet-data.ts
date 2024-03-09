import { PrismaClient } from "@prisma/client";
import { rejects } from "assert";
import fetch from "node-fetch";
import Papa from "papaparse";

const prisma = new PrismaClient();

export const main = async () => {
  const sheetId = "16c60NhScFhAfgdmvZrknL_LBrROoMwbL";
  const gid = "469375981";
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
    await Promise.allSettled(
      rows.map(async (row: any) => {
        const id = row["ENERGY STAR Unique ID"];
        const uniformEnergyFactor = parseFloat(
          row["Uniform Energy Factor (UEF)"],
        );
        if (!uniformEnergyFactor) {
          return;
        }
        try {
          const data = {
            energyStarUniqueId: row["ENERGY STAR Unique ID"] as string,
            energyStarPartner: row["ENERGY STAR Partner"],
            brandName: row["Brand Name"],
            modelName: row["Model Name"],
            modelNumber: row["Model Number"],
            heaterType: row["Type"],
            uniformEnergyFactor,
            upc: row["UPC"],
            ratingOutOf5: parseFloat(row["Rating out of 5"]),
            reviewCount: parseInt(row["Review count"]),
            heatPumpType: row["Heat Pump Type"],
            fuelType: row["Fuel"],
            ventType: row["Vent Type"],
            storageVolumeGallons: parseInt(row["Storage Volume (gallons)"]),
            firstHourRatingGallons: parseInt(
              row["First Hour Rating (gallons)"],
            ),
            maxGallonsPerMinute: parseFloat(row["Maximum Gallons Per Minute"]),
            parentEnergyStarId:
              row["Duplicate ID of"] === "null" ? null : row["Duplicate ID of"],
            inputVoltageHPWH: parseInt(row["Input Voltage for HPWH (V)"]),
            tankHeightInches: parseFloat(row["Tank Height (inches)"]),
            tankDiameterInches: parseFloat(row["Tank Diameter (inches)"]),
          };
          // Upsert the water Heater record
          const { id: waterHeaterId } = await prisma.waterHeater.upsert({
            where: {
              energyStarUniqueId: row["ENERGY STAR Unique ID"],
            },
            update: data,
            create: data,
          });
          // Now see if we need to add a new WaterHeaterPriceRecord
          const priceDate = convertDateStringToDate(row["Date"]);
          const priceInCents =
            !row["Price"] || row["Price"] === "Unable to find"
              ? null
              : convertDollarStrToCents(row["Price"]);
          if (priceInCents) {
            const existingPriceRecord =
              await prisma.waterHeaterPriceRecord.findFirst({
                where: {
                  waterHeaterId,
                  dateRecorded: priceDate,
                },
              });
            if (!existingPriceRecord) {
              // If one doesn't exist, we need to create one
              await prisma.waterHeaterPriceRecord.create({
                data: {
                  waterHeaterId,
                  priceInCents,
                  dateRecorded: priceDate,
                  sourceUrl: row["Source"],
                },
              });
            }
          }
        } catch (error) {
          console.log(error);
          console.log(`Error processing energy star ID: ${id}`);
          throw error;
        }
      }),
    ).then((results) => {
      const successfulCount = results.filter(
        (result) => result.status === "fulfilled",
      ).length;
      const failedCount = results.filter(
        (result) => result.status === "rejected",
      ).length;
      console.log(`Successful: ${successfulCount}`);
      console.log(`Failed: ${failedCount}`);
    });
  } catch (error) {
    console.error("Failed to download the sheet:", error);
  }
};

function convertDollarStrToCents(dollarStr: string): number {
  // This handles the price we have in CSV
  // Remove the dollar sign and commas, then convert to a float
  const amountInDollars = parseFloat(dollarStr.replace(/[$,]/g, ""));
  // Convert dollars to cents
  const amountInCents = Math.round(amountInDollars * 100);
  return amountInCents;
}

function convertDateStringToDate(input: string): Date {
  // This handles the dates we have in CSV e.g. 3/6/24
  // Split the date string into components
  const [month, day, year] = input.split("/").map(Number);
  // Determine the full year. Adjust the pivot year and calculation as necessary.
  const fullYear = year < 70 ? 2000 + year : 1900 + year;
  // Create a Date object. Months are 0-indexed in JavaScript Dates (0 = January, 11 = December)
  const date = new Date(fullYear, month - 1, day);
  return date;
}

main();
