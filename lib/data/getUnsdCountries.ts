import csv from "csvtojson";
import { AreaCode } from "../../types/UnsdCodes";

export default async function getUnsdCountries() {
  const csvFilePath = "./data/static/UNSD-Methodology.csv";
  // source: https://unstats.un.org/unsd/methodology/m49/overview/
  const countries: AreaCode[] = await csv().fromFile(csvFilePath);
  return countries;
}
