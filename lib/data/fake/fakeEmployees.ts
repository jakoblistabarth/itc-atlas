import { faker } from "@faker-js/faker";
import { ApplicantClean } from "../../../types/ApplicantClean";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { sample, sampleSize } from "lodash";
import { EmployeeClean } from "../../../types/EmployeeClean";
import { range } from "d3-array";

type EmployeeFake = EmployeeClean & { applicantId?: string };

const fakeEmployees = async (
  applicants: ApplicantClean[],
  number: number = 3000
) => {
  const countries = await loadUnsdCountries();

  const countriesSample = sampleSize(countries, 75);
  const focusCountries = sampleSize(countriesSample, 7);

  const applicantSample = sampleSize(applicants, number);

  const data = range(1, number).map((d) => {
    const countryPool = Math.random() > 0.5 ? countriesSample : focusCountries;
    const country = sample(countryPool)?.["ISO-alpha3 Code"];
    if (Math.random() < 0.1) {
      const applicant = applicantSample.pop();
      const employee: EmployeeFake = {
        mId: d + "",
        applicantId: applicant?.applicantId,
        dateOfBirth: applicant?.dateOfBirth,
        nationality: applicant?.countryIsoAlpha3,
        gender: applicant?.gender ?? "m",
      };
      return employee;
    }
    const employee: EmployeeFake = {
      mId: d + "",
      dateOfBirth: faker.date.birthdate({ min: 1930, max: 1990 }),
      nationality: country,
      gender: Math.random() < 0.75 ? "m" : "f",
    };
    return employee;
  });

  return data;
};

export default fakeEmployees;
