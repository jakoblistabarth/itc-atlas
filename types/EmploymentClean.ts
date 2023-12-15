import { Department } from "../lib/mappings/departments";

export type EmploymentClean = {
  mId: string;
  mId_actual: string;
  startYear: number;
  endYear: number;
  employedDays?: number;
  unitEndYear?: number;
  departments: Department[];
  type?: string;
  description?: string;
};
