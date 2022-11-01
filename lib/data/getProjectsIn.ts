import getProjects from "./getProjects";
import type { Project } from "../../types/Project";

const getProjectsIn = async (country: string) => {
  const [allProjects] = await Promise.all([getProjects()]);

  const projects = allProjects.filter((row): row is Omit<
    Project,
    "dateStart" | "dateEnd" | "projectID"
  > & {
    dateStart: string;
    dateEnd: string;
    projectID: string;
  } => row.countries.includes(country)); // TODO: use allCountries instead?

  return projects;
};

export default getProjectsIn;
