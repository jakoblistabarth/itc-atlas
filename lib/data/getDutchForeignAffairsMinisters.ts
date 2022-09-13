import csv from "csvtojson";
import { Minister } from "../../types/Minister";

export default async function getDutchForeignAffairsMinisters() {
  const csvFilePath = "./data/static/dutch-foreign-affairs-ministers.csv";
  // source: ?
  const dutchForeignAffairsMinisters: Minister[] = await csv().fromFile(
    csvFilePath
  );
  return dutchForeignAffairsMinisters;
}
