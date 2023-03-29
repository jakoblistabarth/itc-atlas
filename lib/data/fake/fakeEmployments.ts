import { faker } from "@faker-js/faker";
import getRandomElement from "../../utilities/getRandomElement";
import { EmployeeClean } from "../../../types/EmployeeClean";
import { EmploymentClean } from "../../../types/EmploymentClean";
import loadDepartments from "../load/loadDepartments";
import addDays from "../../utilities/addDays";
import { random, range } from "lodash";

const fakeEmployments = async (
  employees: EmployeeClean[],
  number: number = 6000
): Promise<EmploymentClean[]> => {
  const departments = loadDepartments();
  const descriptions = range(100).map((_) => faker.name.jobTitle());

  const data = range(1, number).map((d) => {
    const start = faker.date.between(new Date("1960"), new Date("2022"));
    const duration = random(30 * 5, 365 * 10);
    const end = addDays(start, duration);

    const employment: EmploymentClean = {
      mId: getRandomElement(employees).mId,
      department: getRandomElement(departments).id,
      employmentStart: start,
      employmentEnd: end,
      employmentUnitEnd: new Date(),
      description: getRandomElement(descriptions),
    };
    return employment;
  });

  return data;
};

export default fakeEmployments;
