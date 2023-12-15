import { faker } from "@faker-js/faker";
import { randomInt, range } from "d3";
import { sample, sampleSize } from "lodash";
import { EmployeeClean } from "../../../types/EmployeeClean";
import { EmploymentClean } from "../../../types/EmploymentClean";
import { Department } from "../../mappings/departments";
import addDays from "../../utilities/addDays";
import loadDepartments from "../load/loadDepartments";

const fakeEmployments = async (
  employees: EmployeeClean[],
  number = 6000,
): Promise<EmploymentClean[]> => {
  const departments = loadDepartments();
  const descriptions = range(100).map(() => faker.person.jobTitle());

  const data = range(1, number).map(() => {
    const start = faker.date.between({
      from: new Date("1960"),
      to: new Date("2022"),
    });
    const duration = randomInt(30 * 5, 365 * 10)();
    const end = addDays(start, duration);

    const employment: EmploymentClean = {
      mId: sample(employees)?.mId + "" ?? "0",
      mId_actual: "does not apply",
      departments: sampleSize(departments, randomInt(2)()).map(
        (d) => d.id as Department,
      ),
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
