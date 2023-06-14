import sheetToJson from "./sheetToJson";
import workbookFromXlsx from "./workbookFromXlsx";
import { NfpCountry } from "../../types/NfpCountry";

const filePath = "./data/static/nfpCountries.xlsx";

export const getNfpCountries = async () => {
  const workbook = await workbookFromXlsx(filePath);
  return sheetToJson<NfpCountry[]>(workbook.worksheets[0]);
};

export default getNfpCountries;
