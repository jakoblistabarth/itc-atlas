import { faker } from "@faker-js/faker";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { sampleSize, range, sample, random } from "lodash";
import { PhdClean } from "../../../types/PhdClean";
import loadStatus from "../load/loadStatus";
import loadDepartments from "../load/loadDepartments";
import addDays from "../../utilities/addDays";
import { ApplicantClean } from "../../../types/ApplicantClean";
import { Department } from "../../mappings/departments";

const fakePhds = async (
  applicants: ApplicantClean[],
  number = 750,
): Promise<PhdClean[]> => {
  const countries = await loadUnsdCountries();
  const status = loadStatus();
  const departments = loadDepartments();

  const departmentMain = sample(departments)?.id as Department;
  const departmentsSecondary = sampleSize(
    departments.filter((d) => d.id !== departmentMain),
    random(1, 2),
  ).map((d) => d.id) as Department[];

  const countriesSample = sampleSize(countries, 50);
  const focusCountries = sampleSize(countriesSample, 12);

  const organizationNames = range(200).map(() => faker.company.name());

  const data = range(number).map(() => {
    const countryPool = Math.random() > 0.5 ? countriesSample : focusCountries;
    const country = sample(countryPool)?.["ISO-alpha3 Code"];
    const start = faker.date.between({
      from: new Date("1960"),
      to: new Date(),
    });
    const graduation = addDays(start, 365 * 6);
    const phd: PhdClean = {
      itcStudentId:
        Math.random() > 0.1
          ? sample(applicants)?.itcStudentId ?? undefined
          : undefined,
      country: country ?? "",
      status: sample(Object.values(status))?.id ?? "",
      departmentsMain: [departmentMain],
      departmentsSecondary: departmentsSecondary,
      thesisTitle: faker.lorem.sentence(),
      sponsor: sample(organizationNames) ?? "",
      dateStart: start,
      dateGraduation: graduation,
      yearPromotion: graduation.getFullYear(),
      name: `${faker.person.lastName()}, ${faker.person.firstName()[0]}.`,
      doi: `${faker.internet.url()}`,
    };
    return phd;
  });

  return data;
};

export default fakePhds;
