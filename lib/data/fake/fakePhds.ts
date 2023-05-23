import { faker } from "@faker-js/faker";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { sampleSize, range, sample } from "lodash";
import { Phd } from "../../../types/Phd";
import loadStatus from "../load/loadStatus";
import loadDepartments from "../load/loadDepartments";
import addDays from "../../utilities/addDays";
import { ApplicantClean } from "../../../types/ApplicantClean";

const fakePhds = async (
  applicants: ApplicantClean[],
  number: number = 750
): Promise<Phd[]> => {
  const countries = await loadUnsdCountries();
  const status = loadStatus();
  const departments = loadDepartments();

  const countriesSample = sampleSize(countries, 50);
  const focusCountries = sampleSize(countriesSample, 12);

  const organizationNames = range(200).map((_) => faker.company.name());

  const data = range(number).map((_) => {
    const countryPool = Math.random() > 0.5 ? countriesSample : focusCountries;
    const country = sample(countryPool)?.["ISO-alpha3 Code"];
    const start = faker.date.between(new Date("1960"), new Date());
    const graduation = addDays(start, 365 * 6);
    const phd: Phd = {
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
      dateStart: start.toISOString(),
      dateGraduation: graduation.toISOString(),
      yearPromotion: graduation.getFullYear(),
    };
    return phd;
  });

  return data;
};

export default fakePhds;
