import { faker } from "@faker-js/faker";
import { range } from "d3-array";
import { sample } from "lodash";

type TestRow = {
  name: string;
  date?: string;
  job: string;
};

export default function getBigTestData(): TestRow[] {
  const jobs = range(20).map((i) => faker.name.jobTitle());

  return range(400).map((record) => ({
    name: faker.name.fullName(),
    date: faker.date.between("1950", "2022").toISOString(),
    job: sample(jobs) ?? "",
  }));
}
