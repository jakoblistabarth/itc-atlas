import csv from "csvtojson";
import fs from "fs";
import { AirportProperties } from "../../types/Travels";

const loadAirports = async () => {
  const url = "https://davidmegginson.github.io/ourairports-data/airports.csv";
  const output = "data/topographic/airports.json";
  const fileName = output.slice(output.lastIndexOf("/") + 1);

  if (fs.existsSync(output)) {
    console.log(`📦 File "${fileName}" already exists, download skipped"`);
    return;
  }

  console.log(`downloading airports 🛬 … (${url}) `);
  const response = await fetch(url);
  const string = await response.text();
  const airports = await csv().fromString(string);

  const majorAirports = airports
    .filter((airport) => airport.type === "large_airport")
    .map(
      ({
        longitude_deg,
        latitude_deg,
        iata_code,
        name,
        iso_country,
        home_link,
        wikipedia_link,
      }) =>
        ({
          name,
          longitude: longitude_deg,
          latitude: latitude_deg,
          iataCode: iata_code,
          countryIsoAlpha2: iso_country,
          website: home_link,
          wikipedia: wikipedia_link,
        }) satisfies AirportProperties,
    );

  fs.writeFileSync(output, JSON.stringify(majorAirports));
};

export default loadAirports;
