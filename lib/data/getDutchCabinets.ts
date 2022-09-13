import csv from "csvtojson";
import { DutchCabinet } from "../../types/DutchCabinet";

export default async function getDutchCabinets() {
  const csvFilePath = "./data/static/dutch-cabinets.csv";
  // source: https://en.wikipedia.org/wiki/List_of_cabinets_of_the_Netherlands
  const dutchCabinets: DutchCabinet[] = await csv().fromFile(csvFilePath);
  return dutchCabinets;
}
