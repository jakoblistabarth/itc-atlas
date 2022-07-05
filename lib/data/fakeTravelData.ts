import { faker } from "@faker-js/faker";
import { range } from "d3-array";
import { Flight } from "../../types/Travels";
import getRandomElement from "../utilities/getRandomElement";
import getAirports from "./getAirports";

const fakeTravelData = async (number: number = 500): Promise<Flight[]> => {
  // TODO: use a set of origin-destination combinations to make fake data more realistic
  // hubs improved the results but still too many different combinations
  const airportCodes = (await getAirports()).json
    .filter((airport) => airport.type == "large_airport")
    .filter((airport) => airport.iata_code)
    .filter(() => Math.random() > 0.8)
    .map((airport) => airport.iata_code);
  const hubs = airportCodes.filter(() => Math.random() > 0.95);
  console.log(hubs.length);
  const data = range(0, number).map(() => {
    const traveldays = Math.round(Math.random() * 30);
    const minArrival = new Date("2019");
    minArrival.setDate(minArrival.getDate() + traveldays + 1);
    const arrivalDate = faker.date.between(minArrival, new Date("2020"));
    const departureDate = new Date(arrivalDate.toISOString());
    departureDate.setDate(arrivalDate.getDate() - traveldays);
    const orderDate = faker.date.between(new Date("2019"), departureDate);

    departureDate.setDate(orderDate.getDate() + Math.random());
    const flight: Flight = {
      orderDate: orderDate.toISOString(),
      departureDate: departureDate.toISOString(),
      arrivalDate: arrivalDate.toISOString(),
      airportCodes: getRandomAirports(airportCodes, hubs),
      travelDays: traveldays,
      ticketcount: Math.round(Math.random()),
      fare: parseFloat(faker.commerce.price(100, 3000)),
      tax: parseFloat(faker.commerce.price(0, 700)),
      ref1: "93" + faker.random.numeric(6),
      ref2: faker.random.numeric(4),
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
  const originAirport = getRandomElement(airportCodes);
  const stops = range(0, numberOfStops).map(() => {
    const list = Math.random() < 0.99 ? hubs : airportCodes;
    return getRandomElement(list);
  });

  const codes = [originAirport, ...stops];
  if (Math.random() > 0.3) codes.push(originAirport);

  return codes;
};

export default fakeTravelData;
