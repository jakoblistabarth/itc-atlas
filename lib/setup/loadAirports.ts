import axios from "axios";
import csv from "csvtojson";
import fs from "fs";

const loadAirports = async () => {
  const url = "https://datahub.io/core/airport-codes/r/airport-codes.csv";

  console.log(`downloading airports ✈️ … (${url}) `);
  const body = await axios.get(url, {
    responseType: "blob",
  });
  const airports = await csv().fromString(body.data);

  const majorAirports = airports.filter(
    (airport) =>
      // ["medium_airport", "large_airport"].includes(airport.type)
      airport.type === "large_airport"
  );

  majorAirports.forEach((airport) => {
    const [lon, lat] = airport.coordinates.split(", ");
    airport.lon = lon;
    airport.lat = lat;
    delete airport.coordinates;
  });

  fs.writeFileSync(
    "data/topographic/airports.json",
    JSON.stringify(majorAirports)
  );
};

export default loadAirports;
