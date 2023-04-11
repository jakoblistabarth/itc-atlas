import { faker } from "@faker-js/faker";
import { random, range, sample, sampleSize } from "lodash";
import { Flight2019Clean } from "../../data/clean/cleanTravels2019";
import getAirports from "../getAirports";
import loadDepartments from "../load/loadDepartments";
import loadUnsdCountries from "../load/loadUnsdCountries";

const fakeFlights2019 = async (
  number: number = 900
): Promise<Flight2019Clean[]> => {
  // TODO: use a set of origin-destination combinations to make fake data more realistic
  // hubs improved the results but still too many different combinations
  const airportCodes = (await getAirports()).json
    .filter((airport) => airport.type == "large_airport")
    .filter((airport) => airport.iata_code)
    .map((airport) => airport.iata_code);
  const hubs = sampleSize(airportCodes, 6);
  const departments = loadDepartments();
  const countries = await loadUnsdCountries();
  const data = range(number).map(() => {
    const traveldays = random(1, 30);
    const minArrival = new Date("2019");
    minArrival.setDate(minArrival.getDate() + traveldays + 1);
    const arrivalDate = faker.date.between(minArrival, new Date("2020"));
    const departureDate = new Date(arrivalDate.toISOString());
    departureDate.setDate(arrivalDate.getDate() - traveldays);
    const orderDate = faker.date.between(new Date("2019"), departureDate);
    departureDate.setDate(orderDate.getDate() + Math.random());
    const flight: Flight2019Clean = {
      departure: departureDate.toISOString(),
      arrival: arrivalDate.toISOString(),
      airportCodes: getRandomAirports(airportCodes, hubs),
      ref1: "93" + faker.random.numeric(6),
      ref2: faker.random.numeric(4),
      country: sample(countries)?.["ISO-alpha3 Code"] ?? "",
      emissions: +faker.random.numeric(4),
      department: sample(departments)?.number ?? 0,
    };
    return flight;
  });

  return data;
};

const getRandomAirports = (
  airportCodes: string[],
  hubs: string[]
): string[] => {
  const numberOfStops = Math.ceil(Math.pow(Math.random(), 24) * 4);
  const originAirport = sample(airportCodes) as string;
  const stops = Array.from({ length: numberOfStops }).map(() => {
    const pool = Math.random() < 0.99 ? hubs : airportCodes;
    return sample(pool) as string;
  });

  const codes = [originAirport, ...stops];
  if (Math.random() > 0.3) codes.push(originAirport);

  return codes;
};

export default fakeFlights2019;
