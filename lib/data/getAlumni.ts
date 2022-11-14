import fs from "fs";
import { Alumni } from "../../types/Alumni";

export default async function getAlumni() {
  const filePath = "./data/itc/alumni.json";
  const rawdata = fs.readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data as Alumni[];
}
