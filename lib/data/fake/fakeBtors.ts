import { faker } from "@faker-js/faker";
import { BtorClean } from "../clean/cleanBTORs";
import loadDepartments from "../load/loadDepartments";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { PurposeOfTravel } from "@prisma/client";
import addDays from "../../utilities/addDays";
import { random, range, sample } from "lodash";

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
      (_) => sample(countries)?.["ISO-alpha3 Code"] as string
    );
    const btor: BtorClean = {
      id: i,
      budgetId: faker.random.numeric(6),
      start: departureDate.toISOString(),
      end: arrivalDate.toISOString(),
      year: departureDate.getFullYear(),
      department: sample(departments)?.id ?? "",
      countries: travelledCountries,
      purpose: sample(Object.values(PurposeOfTravel)) ?? "",
    };
    return btor;
  });

  return data;
};

export default fakeBtors;
