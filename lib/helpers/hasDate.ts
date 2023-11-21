import { ProjectsWithCountries } from "../data/queries/project/getProjectsWithCountries";

type ProjectWithDate = Omit<ProjectsWithCountries[number], "start"> & {
  start: string;
};

export const hasDate = (
  project: ProjectsWithCountries[number] | ProjectWithDate,
): project is ProjectWithDate =>
  project.start !== undefined && project.start !== null;
