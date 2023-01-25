import csv from "csvtojson";
import { AreaCode } from "../../../types/UnsdCodes";

export default async function loadUnsdCountries() {
  const csvFilePath = "./data/static/UNSD-Methodology.csv";
  // source: https://unstats.un.org/unsd/methodology/m49/overview/
  const countries: AreaCode[] = await csv({ delimiter: ";" }).fromFile(
    csvFilePath
  );
  return countries;
}
