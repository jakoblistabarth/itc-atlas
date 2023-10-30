import fs from "fs";

type DepartmentRaw = {
  id: string;
  name: string;
  number: number;
};

export default function loadDepartments(): DepartmentRaw[] {
  const filePath = "./data/static/departments.json";
  const rawdata = fs.readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data as DepartmentRaw[];
}
