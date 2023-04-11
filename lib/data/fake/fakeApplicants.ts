import { faker } from "@faker-js/faker";
import { ApplicantClean } from "../../../types/ApplicantClean";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { sampleSize, range, sample } from "lodash";

const fakeApplicants = async (
  number: number = 4000
): Promise<ApplicantClean[]> => {
  const countries = await loadUnsdCountries();

  const countriesSample = sampleSize(countries, 75);
  const focusCountries = sampleSize(countriesSample, 7);

  const data = range(number).map((d) => {
    const countryPool = Math.random() > 0.5 ? countriesSample : focusCountries;
    const country = sample(countryPool)?.["ISO-alpha3 Code"];
    const applicant: ApplicantClean = {
      applicantId: "RL" + String(d).padStart(6, "0"),
      itcStudentId: Math.random() > 0.25 ? "itc" + d : undefined,
      countryIsoAlpha3: country ?? "",
      gender: Math.random() < 0.75 ? "m" : "f",
      dateOfBirth: faker.date.birthdate(),
    };
    return applicant;
  });

  return data;
};

export default fakeApplicants;
