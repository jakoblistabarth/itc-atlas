import { faker } from "@faker-js/faker";
import { BtorClean } from "../clean/cleanBTORs";
import getRandomElement from "../../utilities/getRandomElement";
import loadDepartments from "../load/loadDepartments";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { PurposeOfTravel } from "@prisma/client";
import addDays from "../../utilities/addDays";
import { random, range } from "lodash";

const fakeBtors = async (number: number = 5000): Promise<BtorClean[]> => {
  const departments = loadDepartments();
  const countries = await loadUnsdCountries();
  const data = range(number).map((_, i) => {
    const traveldays = random(1, 31);
    const departureDate = faker.date.between(
      new Date("2000"),
      new Date("2022")
    );
    const arrivalDate = addDays(departureDate, traveldays);
    const travelledCountries = Array.from({ length: random(1, 3) }).map(
      (_) => getRandomElement(countries)["ISO-alpha3 Code"]
    );
    const btor: BtorClean = {
      id: i,
      budgetId: faker.random.numeric(6),
      start: departureDate.toISOString(),
      end: arrivalDate.toISOString(),
      year: departureDate.getFullYear(),
      department: getRandomElement(departments).id,
      countries: travelledCountries,
      purpose: getRandomElement(Object.values(PurposeOfTravel)),
    };
    return btor;
  });

  return data;
};

export default fakeBtors;
