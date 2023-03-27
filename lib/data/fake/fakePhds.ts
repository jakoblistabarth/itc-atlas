import { faker } from "@faker-js/faker";
import getRandomElement from "../../utilities/getRandomElement";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { sampleSize, range } from "lodash";
import { PhdCandidate } from "../../../types/PhdCandidate";
import loadStatus from "../load/loadStatus";
import loadDepartments from "../load/loadDepartments";
import addDays from "../../utilities/addDays";
import { ApplicantClean } from "../../../types/ApplicantClean";

const fakePhds = async (
  applicants: ApplicantClean[],
  number: number = 750
): Promise<PhdCandidate[]> => {
  const countries = await loadUnsdCountries();
  const status = loadStatus();
  const departments = loadDepartments();

  const countriesSample = sampleSize(countries, 50);
  const focusCountries = sampleSize(countriesSample, 12);

  const organizationNames = range(200).map((_) => faker.company.name());

  const data = range(number).map((d) => {
    const countryPool = Math.random() > 0.5 ? countriesSample : focusCountries;
    const country = getRandomElement(countryPool)["ISO-alpha3 Code"];
    const start = faker.date.between(new Date("1960"), new Date());
    const graduation = addDays(start, 365 * 6);
    const phdCandidate: PhdCandidate = {
      itcStudentId:
        Math.random() > 0.1
          ? getRandomElement(applicants).itcStudentId ?? null
          : null,
      country: country,
      status: getRandomElement(Object.values(status)).id,
      department1: getRandomElement(departments).id,
      department2: getRandomElement(departments).id,
      thesisTitle: faker.lorem.sentence(),
      sponsor: getRandomElement(organizationNames),
      dateStart: start.toISOString(),
      dateGraduation: graduation.toISOString(),
      yearPromotion: graduation.getFullYear(),
    };
    return phdCandidate;
  });

  return data;
};

export default fakePhds;
