export enum ProjectStatus {
  Undone = "undone",
  Completed = "completed",
  Ongoing = "ongoing",
}

export enum ProjectType {
  Consulting = "Consulting",
  ContractEducation = "Contract Education",
  ContractResearch = "Contract Research",
  EducationAndTraining = "Education and Training",
  Other = "Other",
  Research = "Research",
}

export type ProjectIndonesia = {
  id?: null;
  nameShort?: null;
  type?: ProjectType;
  status?: ProjectStatus;
  dateStart?: null;
  dateEnd?: null;
  department?: string;
  totalBudget?: string;
  budgetScaled?: string;
  projectSupervisor?: string;
  projectPartner?: string;
};
