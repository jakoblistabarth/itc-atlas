import { DataFrame, Row } from "./DataFrame";

// export interface ProjectTable extends Table {
//   Array<Project>
// }

export type Project = {
  projectID: string | null;
  projectName: string | null;
  projectShortName: string | null;
  countries: string[];
  type: ProjectType | null;
  status: ProjectStatus | null;
  dateStart: string | null;
  dateEnd: string | null;
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
