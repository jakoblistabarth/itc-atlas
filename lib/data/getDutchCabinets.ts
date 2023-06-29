import csv from "csvtojson";
import { DutchCabinet } from "../../types/DutchCabinet";

export default async function getDutchCabinets() {
  const csvFilePath = "./data/static/dutch-cabinets.csv";
  // source: https://en.wikipedia.org/wiki/List_of_cabinets_of_the_Netherlands
  const dutchCabinets = await csv({
    colParser: {
      //TODO: use superjson for static props?
      // dateStart: (item) => new Date(item),
      // dateEnd: (item) => new Date(item)
    },
  }).fromFile(csvFilePath);
  dutchCabinets.forEach(
    (d) => (d.topics = d.topics.includes("|") ? d.topics.split("|") : null)
  );
  return dutchCabinets as DutchCabinet[];
}
