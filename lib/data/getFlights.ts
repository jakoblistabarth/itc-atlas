import xlsx from "xlsx";
import getODMatrix from "./getODMatrix";
import getAirports from "./getAirports";
import countFlightsperAirport from "./countFlightsPerAirport";

export default async function getFlights() {
  const filePath = "./data/UT.01jan-31dec2019-ITConly.xlsx";
  const file = xlsx.readFile(filePath);
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  const flights = data
    .filter((d) => d["Sales Type"] !== "Train")
    .filter((d) => d.Route);
  flights.forEach((d) => {
    d.airportCodes = d.Route.split("-");
  });

  const flightsMJ = flights.filter((row) =>
    row["Passenger Name"].match("KRAAK")
  );
  const airports = await (await getAirports()).json;

  const odMatrix = await getODMatrix(flights);
  const odMatrixMJ = await getODMatrix(flightsMJ);
  const perAirport = countFlightsperAirport(flights, airports);

  return {
    allTravels: data,
    flights: flights,
    odMatrix: odMatrix,
    odMatrixMJ: odMatrixMJ,
    perAirport: perAirport,
  };
}
