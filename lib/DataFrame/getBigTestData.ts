import { faker } from "@faker-js/faker";
import { range } from "d3-array";
import getRandomElement from "../utilities/getRandomElement";

type TestRow = {
  name: string;
  date?: string;
  job: string;
};

export default function getTestData(): TestRow[] {
  const jobs = range(20).map((i) => faker.name.jobTitle());

  return range(400).map((record) => ({
    name: faker.name.findName(),
    date: faker.date.between("1950", "2022").toISOString(),
    job: getRandomElement(jobs),
  }));
}
