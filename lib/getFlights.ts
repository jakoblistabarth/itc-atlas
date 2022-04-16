import xlsx from "xlsx";
import createODMatrix from "./createODMatrix";
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

  const odMatrix = await createODMatrix(flights);
  const odMatrixMJ = await createODMatrix(flightsMJ);
  const perAirport = countFlightsperAirport(flights, airports);

  return {
    allTravels: data,
    flights: flights,
    odMatrix: odMatrix,
    odMatrixMJ: odMatrixMJ,
    perAirport: perAirport,
  };
}
