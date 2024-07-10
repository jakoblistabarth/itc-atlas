import { Department } from "../lib/mappings/departments";

export type PhdClean = {
  itcStudentId: string | undefined;
  country: string | null;
  departmentsMain?: Department[];
  departmentsSecondary?: Department[];
  sponsor: string | null;
  status: string;
  dateStart: Date | null;
  dateGraduation: Date | null;
  yearPromotion: number | null;
  dissertationNumber: number | null;
  thesisTitle: string | null;
  doi: string | null;
  name: string | null;
};
