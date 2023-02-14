import xlsx from "xlsx";
import cleanBTORs from "../clean/cleanBTORs";

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
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  }) as BtorRaw[];

  return await cleanBTORs(data);
}
