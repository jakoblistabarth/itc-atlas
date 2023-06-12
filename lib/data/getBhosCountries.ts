import { BhosCountry } from "../../types/BhosCountry";
import sheetToJson from "./sheetToJson";
import workbookFromXlsx from "./workbookFromXlsx";

const getBhosCountries = async () => {
  const filePath = "./data/static/Bhos.xlsx";
  const workbook = await workbookFromXlsx(filePath);
  return sheetToJson<BhosCountry[]>(workbook.worksheets[0]);
};

export default getBhosCountries;
