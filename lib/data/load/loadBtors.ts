import cleanBTORs from "../clean/cleanBTORs";
import sheetToJson from "../sheetToJson";
import workbookFromXlsx from "../workbookFromXlsx";

export type BtorRaw = {
  Year: number;
  ID: number;
  Name: string;
  Dept: string;
  Destination: string;
  "Purpose of travel": string;
  Budget: string;
  Departure: Date;
  Return: Date;
  "Nr of days": number;
};

export default async function loadBtors() {
  const filePath = "./data/itc/BACKTOOFFICEREPORTS.xlsx";
  const workbook = await workbookFromXlsx(filePath);
  const data = sheetToJson<BtorRaw[]>(workbook.worksheets[0]);

  return await cleanBTORs(data);
}
