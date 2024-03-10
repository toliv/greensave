import { PrismaClient, ZipCodeReference } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import fetch from "node-fetch";
import Papa from "papaparse";

const prisma = new PrismaClient();

export const main = async () => {
  const sheetId = "16c60NhScFhAfgdmvZrknL_LBrROoMwbL";
  const gid = "1590742753";
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
    const recordsToInsert: Omit<ZipCodeReference, "id">[] = rows.map(
      (row: any) => {
        return {
          latitude: new Decimal(row["lat"]),
          longitude: new Decimal(row["lng"]),
          cityName: row["city"] as string,
          stateAbbreviation: row["state_id"] as string,
          stateName: row["state_name"] as string,
          zipCode: row["zip"] as string,
          isSunBeltLocation: row["SUN BELT?"] === "TRUE" ? true : false,
        };
      },
    );
    // Delete everything
    await prisma.zipCodeReference.deleteMany({});
    // Insert everything
    await prisma.zipCodeReference.createMany({
      data: recordsToInsert,
    });
  } catch (error) {
    console.error("Failed to download the sheet:", error);
  }
};

main();
