import { faker } from "@faker-js/faker";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { sampleSize, range, sample } from "lodash";
import { PhdClean } from "../../../types/PhdClean";
import loadStatus from "../load/loadStatus";
import loadDepartments from "../load/loadDepartments";
import addDays from "../../utilities/addDays";
import { ApplicantClean } from "../../../types/ApplicantClean";

const fakePhds = async (
  applicants: ApplicantClean[],
  number = 750
): Promise<PhdClean[]> => {
  const countries = await loadUnsdCountries();
  const status = loadStatus();
  const departments = loadDepartments();

  const countriesSample = sampleSize(countries, 50);
  const focusCountries = sampleSize(countriesSample, 12);

  const organizationNames = range(200).map(() => faker.company.name());

  const data = range(number).map(() => {
    const countryPool = Math.random() > 0.5 ? countriesSample : focusCountries;
    const country = sample(countryPool)?.["ISO-alpha3 Code"];
    const start = faker.date.between(new Date("1960"), new Date());
    const graduation = addDays(start, 365 * 6);
    const phd: PhdClean = {
      itcStudentId:
        Math.random() > 0.1
          ? sample(applicants)?.itcStudentId ?? undefined
          : undefined,
      country: country ?? "",
      status: sample(Object.values(status))?.id ?? "",
      department1: sample(departments)?.id ?? "",
      department2: sample(departments)?.id ?? "",
      thesisTitle: faker.lorem.sentence(),
      sponsor: sample(organizationNames) ?? "",
      dateStart: start,
      dateGraduation: graduation,
      yearPromotion: graduation.getFullYear(),
    };
    return phd;
  });

  return data;
};

export default fakePhds;
