import { ProjectStatus } from "@prisma/client";

export enum ProjectType {
  Consulting = "Consulting",
  ContractEducation = "Contract Education",
  ContractResearch = "Contract Research",
  EducationAndTraining = "Education and Training",
  Other = "Other",
  Research = "Research",
}

export type ProjectIndonesia = {
  nameShort?: null;
  type?: ProjectType;
  status?: ProjectStatus;
  dateStart?: null;
  dateEnd?: null;
  department?: string;
  projectPartner?: string;
};
