import xlsx from "xlsx";
import cleanProjects from "./cleanProjects";

export default async function getProjects() {
  const filePath = "./data/ITCProjects.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const sheetNames = file.SheetNames;
  const projectsPre2019 = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
  const projectsPost2019 = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[1]]);

  const projects = await cleanProjects([projectsPre2019, projectsPost2019]);

  return projects;
}
