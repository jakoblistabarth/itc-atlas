import { faker } from "@faker-js/faker";
import { ProjectClean } from "../clean/cleanProjects";
import getRandomElement from "../../utilities/getRandomElement";
import loadDepartments from "../load/loadDepartments";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { ProjectStatus, ProjectType } from "@prisma/client";
import addDays from "../../utilities/addDays";
import { random, range, sampleSize } from "lodash";

const fakeProjects = async (number: number = 1600): Promise<ProjectClean[]> => {
  const departments = loadDepartments();
  const countries = await loadUnsdCountries();

  const countriesSample = sampleSize(countries, 75);
  const focusCountries = sampleSize(countriesSample, 7);

  const data = range(number).map((_, i) => {
    const leadDepartment = getRandomElement(departments);
    const otherDepartments = Array.from({
      length: random(1, 3),
    }).reduce((acc: string[], _) => {
      const department = getRandomElement(departments).id;
      if (!acc.includes(department) && department !== leadDepartment.id)
        acc.push(department);
      return acc;
    }, []);

    const durationInDays = random(30, 365 * 3);
    const start = faker.date.between(new Date("2000"), new Date("2022"));
    const end = addDays(start, durationInDays);
    const projectCountries = range(random(1, 3)).map((_) => {
      const pool = Math.random() < 0.5 ? focusCountries : countriesSample;
      return getRandomElement(pool)["ISO-alpha3 Code"];
    });
    const organizationNames = range(200).map((_) => faker.company.name());
    const project: ProjectClean = {
      id: i,
      name: faker.lorem.sentence(),
      nameShort: faker.lorem.sentence(3),
      description: faker.lorem.paragraphs(),
      dateStart: start.toISOString(),
      dateEnd: end.toISOString(),
      leadDepartment: leadDepartment.id,
      otherDepartments: otherDepartments,
      allCountries: projectCountries,
      type: getRandomElement(Object.values(ProjectType)),
      status: getRandomElement(Object.values(ProjectStatus)),
      leadOrganization: getRandomElement(organizationNames),
      fundingOrganization: getRandomElement(organizationNames),
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
