import { faker } from "@faker-js/faker";
import { ProjectClean } from "../clean/cleanProjects";
import loadDepartments from "../load/loadDepartments";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { ProjectStatus, ProjectType } from "@prisma/client";
import addDays from "../../utilities/addDays";
import { random, range, sample, sampleSize } from "lodash";
import { Department } from "../../mappings/departments";

const fakeProjects = async (number = 1600): Promise<ProjectClean[]> => {
  const departments = loadDepartments();
  const countries = await loadUnsdCountries();

  const countriesSample = sampleSize(countries, 75);
  const focusCountries = sampleSize(countriesSample, 7);

  const data = range(number).map((_, i) => {
    const departmentsMain = sampleSize(departments, random(1, 2)).map(
      (d) => d.id,
    ) as Department[];
    const departmentsSecondary = sampleSize(
      departments.filter((d) => !departmentsMain.includes(d.id as Department)),
      random(1, 3),
    ).map((d) => d.id) as Department[];

    const durationInDays = random(30, 365 * 3);
    const start = faker.date.between(new Date("2000"), new Date("2022"));
    const end = addDays(start, durationInDays);
    const projectCountries = range(random(1, 3)).map(() => {
      const pool = Math.random() < 0.5 ? focusCountries : countriesSample;
      return sample(pool)?.["ISO-alpha3 Code"] as string;
    });
    const organizationNames = range(200).map(() => faker.company.name());
    const project: ProjectClean = {
      id: i,
      name: faker.lorem.sentence(),
      nameShort: faker.lorem.sentence(3),
      description: faker.lorem.paragraphs(),
      dateStart: start.toISOString(),
      dateEnd: end.toISOString(),
      departmentsMain: departmentsMain,
      departmentsSecondary: departmentsSecondary,
      allCountries: projectCountries,
      type: sample(Object.values(ProjectType)) ?? "",
      status: sample(Object.values(ProjectStatus)) ?? "",
      leadOrganization: sample(organizationNames) ?? "",
      fundingOrganization: sample(organizationNames) ?? "",
      fundingType: "",
      countriesRegion: "",
      countriesRegionArr: [],
      countries: [],
      regions: [],
      intermediateRegions: [],
      subRegions: [],
      tenderType: "",
      totalBudget: 0,
      totalITCBudget: 0,
    };
    return project;
  });

  return data;
};

export default fakeProjects;
