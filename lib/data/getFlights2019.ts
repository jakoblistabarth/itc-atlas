import xlsx from "xlsx";
import getODMatrix from "./getODMatrix";
import getAirports from "./getAirports";
import countFlightsperAirport from "./countFlightsPerAirport";
import cleanTravelData2019 from "./cleanFlights2019";

export default async function getFlights2019() {
  const filePath = "./data/itc/UT.01jan-31dec2019-ITConly.xlsx";
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
