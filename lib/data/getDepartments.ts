import fs from "fs";

type DepartmentRaw = {
  code: string;
  name: string;
};

export default async function getProjects(): Promise<DepartmentRaw[]> {
  const filePath = "./data/static/departments.json";
  const rawdata = fs.readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data as DepartmentRaw[];
}
