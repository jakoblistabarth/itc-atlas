import csv from "csvtojson";
import fs from "fs";

const loadAirports = async () => {
  const url = "https://datahub.io/core/airport-codes/r/airport-codes.csv";
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

  const majorAirports = airports.filter(
    (airport) => airport.type === "large_airport"
  );

  majorAirports.forEach((airport) => {
    const [lon, lat] = airport.coordinates.split(", ");
    airport.lon = lon;
    airport.lat = lat;
    delete airport.coordinates;
  });

  fs.writeFileSync(output, JSON.stringify(majorAirports));
};

export default loadAirports;
