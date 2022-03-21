import * as csv from "csvtojson";

export default async function getAirports() {
  const csvFilePath = "./data/airports.csv";
  const airports = await csv().fromFile(csvFilePath);
  return airports;
}
