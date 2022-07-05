import xlsx from "xlsx";
import getODMatrix from "./getODMatrix";
import getAirports from "./getAirports";
import countFlightsperAirport from "./countFlightsPerAirport";
import cleanTravelData2019 from "./cleanTravelData2019";
import fakeTravelData from "./fakeTravelData";

export default async function getFlights() {
  const filePath = "./data/thematic/UT.01jan-31dec2019-ITConly.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  //TODO: use if excel sheet does not exist? or based on variable?
  const devMode = true;
  const flights = devMode ? await fakeTravelData() : cleanTravelData2019(data);

  const airports = await (await getAirports()).json;

  const odMatrix = await getODMatrix(flights);
  const perAirport = countFlightsperAirport(flights, airports);

  return {
    allTravels: data,
    flights: flights,
    odMatrix: odMatrix,
    perAirport: perAirport,
  };
}
