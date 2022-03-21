import xlsx from "xlsx";
import createODMatrix from "./createODMatrix";
import getAirports from "./getAirports";

export default async function getFlights() {
  const filePath = "./data/UT.01jan-31dec2019-ITConly.xlsx";
  const file = xlsx.readFile(filePath);
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    raw: false,
  });

  const flights = data
    .filter((d) => d["Sales Type"] !== "Train")
    .filter((d) => d.Route);
  flights.forEach((d) => {
    d.airportCodes = d.Route.split("-");
  });

  const airports = await getAirports();

  const odMatrix = createODMatrix(flights, airports);

  return {
    originalData: data,
    flights: flights,
    odMatrix: odMatrix,
    airports: airports,
  };
}
