import xlsx from "xlsx";
import { Project } from "../pages/api/data/projects";
import cleanProjects from "./cleanProjects";

export default async function getProjects(): Promise<Project[]> {
  const filePath = "./data/ITCProjects.xlsx";
  const file = xlsx.readFile(filePath);
  const sheetNames = file.SheetNames;
  const projectsPre2019 = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
  const projectsPost2019 = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[1]]);

  const projects = await cleanProjects([projectsPre2019, projectsPost2019]);

  return projects.map(
    ({
      projectID,
      projectName,
      projectShortName,
      countries,
      type,
      status,
      dateStart,
      dateEnd,
    }) => ({
      projectID,
      projectName,
      projectShortName,
      countries,
      type,
      status,
      dateStart,
      dateEnd,
    })
  );
}
