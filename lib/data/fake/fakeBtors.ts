import { faker } from "@faker-js/faker";
import { PurposeOfTravel } from "@prisma/client";
import { randomInt, range } from "d3";
import { sample, sampleSize } from "lodash";
import { Department } from "../../mappings/departments";
import addDays from "../../utilities/addDays";
import { BtorClean } from "../clean/cleanBTORs";
import loadDepartments from "../load/loadDepartments";
import loadUnsdCountries from "../load/loadUnsdCountries";

const fakeBtors = async (number = 5000): Promise<BtorClean[]> => {
  const departments = loadDepartments();
  const countries = await loadUnsdCountries();
  const countriesSelection = sampleSize(countries, 30);
  const data = range(number).map((_, i) => {
    const traveldays = randomInt(1, 31)();
    const departureDate = faker.date.between({
      from: new Date("2000"),
      to: new Date("2022"),
    });
    const arrivalDate = addDays(departureDate, traveldays);
    const travelledCountries = sampleSize(
      countriesSelection,
      randomInt(1, 4)(),
    ).map((d) => d["ISO-alpha3 Code"] as string);
    const btor: BtorClean = {
      id: i,
      budgetId: faker.string.numeric(6),
      start: departureDate.toISOString(),
      end: arrivalDate.toISOString(),
      year: departureDate.getFullYear(),
      departments: sampleSize(departments, randomInt(2)()).map(
        (d) => d.id as Department,
      ),
      countries: travelledCountries,
      purpose: sample(Object.values(PurposeOfTravel)) ?? "",
    };
    return btor;
  });

  return data;
};

export default fakeBtors;
