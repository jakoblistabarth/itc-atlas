export type Project = {
  projectID: string | null;
  projectName: string | null;
  projectShortName: string | null;
  remarks: string | null;
  countries: string[];
  allCountries: string[];
  type: ProjectType | null;
  status: ProjectStatus | null;
  dateStart: string | null;
  dateEnd: string | null;
  result: string | null;
  nextAction: string | null;
  projectSummary: string | null;
  fundingType: string | null;
  tenderType: string | null;
  percentageCoveredByITC: string | null;
  percentageCoveredByPartners: string | null;
  division: string | null;
  projectOfficer: string | null;
  projectSupervisor: string | null;
  projectAdministrator: string | null;
  ITCStaffInvolved: number | null;
  manMonthsITC: number | null;
  manMonthsPartners: number | null;
  personMonthsAbroad: number | null;
  personMonthsNL: number | null;
  studentMonthsAbroad: number | null;
  studentMonthsNL: number | null;
  totalBudget: number | null;
  totalITCBudget: number | null;
  subContractorBudget: number | null;
  consultingBudget: number | null;
};

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

export type ProjectIndonesia = Project & {
  projectPartner?: string;
};
