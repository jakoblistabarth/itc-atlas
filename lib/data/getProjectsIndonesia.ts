import fs from "fs";
import { ProjectIndonesia } from "../../types/Project";

const getProjectsIndonesia = async (): Promise<ProjectIndonesia[]> => {
  const filePath = "./data/itc/projects-indonesia.json";
  const rawdata = fs.readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data as ProjectIndonesia[];
};

export default getProjectsIndonesia;
