import fs from "fs";
import { Project } from "../../types/Project";

export default async function getProjects(): Promise<Project[]> {
  const filePath = "./data/itc/projects-indonesia.json";
  const rawdata = fs.readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data as Project[];
}
