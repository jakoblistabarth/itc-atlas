import * as d3 from "d3";
import getProjects from "./getProjects";
import type { Project } from "../../types/Project";

const getProjectsPerCountry = async (country: string) => {
  const [allProjects] = await Promise.all([getProjects()]);

  const projects = allProjects.filter((row): row is Omit<
    Project,
    "dateStart" | "dateEnd" | "projectID"
  > & {
    dateStart: string;
    dateEnd: string;
    projectID: string;
  } => row.countries.includes(country));

  return projects;
};

export default getProjectsPerCountry;
