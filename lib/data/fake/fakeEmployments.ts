import { faker } from "@faker-js/faker";
import { EmployeeClean } from "../../../types/EmployeeClean";
import { EmploymentClean } from "../../../types/EmploymentClean";
import loadDepartments from "../load/loadDepartments";
import addDays from "../../utilities/addDays";
import { randomInt, range } from "d3";
import { sample } from "lodash";

const fakeEmployments = async (
  employees: EmployeeClean[],
  number: number = 6000
): Promise<EmploymentClean[]> => {
  const departments = loadDepartments();
  const descriptions = range(100).map((_) => faker.name.jobTitle());

  const data = range(1, number).map((d) => {
    const start = faker.date.between(new Date("1960"), new Date("2022"));
    const duration = randomInt(30 * 5, 365 * 10)();
    const end = addDays(start, duration);

    const employment: EmploymentClean = {
      mId: sample(employees)?.mId + "" ?? "0",
      mId_actual: "does not apply",
      department: sample(departments)?.id,
      startYear: start.getFullYear(),
      endYear: end.getFullYear(),
      unitEndYear: undefined,
      employedDays: duration,
      description: sample(descriptions),
    };
    return employment;
  });

  return data;
};

export default fakeEmployments;
