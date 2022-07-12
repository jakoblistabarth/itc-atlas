import xlsx from "xlsx";
import getODMatrix from "./getODMatrix";
import getAirports from "./getAirports";
import countFlightsperAirport from "./countFlightsPerAirport";
import cleanTravelData2019 from "./cleanTravelData2019";
import fakeTravelData from "../setup/fakeTravelData";
import fs from "fs";

export default async function getFlights() {
  const filePath = "./data/itc/UT.01jan-31dec2019-ITConly.xlsx";

  // const flights: Flight[] = [];

  // fs.access(filePath, async (err) => {
  //   if (err) {
  //     const fakeFlights = await fakeTravelData();
  //     flights.push(...fakeFlights);
  //     return;
  //   }
  //   const file = xlsx.readFile(filePath, {
  //     cellDates: true,
  //   });
  //   const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
  //     defval: null,
  //   });
  //   flights.push(...cleanTravelData2019(data));
  // });

  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });
  const flights = cleanTravelData2019(data);

  const airports = getAirports().json;

  const odMatrix = await getODMatrix(flights);
  const perAirport = countFlightsperAirport(flights, airports);

  return {
    flights,
    odMatrix,
    perAirport,
  };
}
