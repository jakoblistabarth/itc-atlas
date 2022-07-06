import { faker } from "@faker-js/faker";
import range from "../utilities/range"; // FIXME: workaround due to failed module workaround
import { Flight } from "../../types/Travels";
import getRandomElement from "../utilities/getRandomElement";
import getAirports from "../data/getAirports";

// TODO: change function so that it returns an excel file or (database output?) similar to the actual input
const fakeTravelData = async (number: number = 1000): Promise<Flight[]> => {
  const airports = (await getAirports()).json;
  const airportSelection = airports
    .filter(
      (airport) =>
        airport.iata_code &&
        airport.iata_code !== "AMS" &&
        airport.type == "large_airport"
    )
    .filter(() => Math.random() > 0.9);
  const hubs = airportSelection.filter(() => Math.random() > 0.98);
  const ams = airports.find((airport) => airport.iata_code === "AMS");
  if (!hubs.map((hub) => hub.iata_code).includes("AMS") && ams) hubs.push(ams);
  const data = range(number).map(() => {
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
      airportCodes: getRandomAirports(
        airportSelection.map((d) => d.iata_code),
        hubs.map((d) => d.iata_code)
      ),
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
  const numberOfStops = Math.ceil(Math.pow(Math.random(), 24) * 5);
  const originAirport = getRandomElement(hubs);
  const stops = range(numberOfStops).map(() => {
    const list = Math.random() < 0.7 ? hubs : airportCodes;
    return getRandomElement(list);
  });

  const codes = [originAirport, ...stops];
  if (Math.random() > 0.3) codes.push(originAirport);

  return codes;
};

export default fakeTravelData;
