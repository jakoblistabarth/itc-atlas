import fs from "fs";

type DepartmentRaw = {
  id: string;
  name: string;
};

export default function getDepartments(): DepartmentRaw[] {
  const filePath = "./data/static/departments.json";
  const rawdata = fs.readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data as DepartmentRaw[];
}
