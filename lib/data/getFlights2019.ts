import xlsx from "xlsx";
import getODMatrix from "./getODMatrix";
import getAirports from "./getAirports";
import countFlightsperAirport from "./countFlightsPerAirport";
import cleanTravelData2019 from "./cleanFlights2019";

export type Travels2019Raw = {
  "Passenger Name": string;
  "Departure location": string;
  Country: string;
  Route: string;
  ClassType?: string;
  Area: string;
  "Distance in km": number;
  Supplier: string;
  Airline: string;
  Exchange?: string;
  Region: string;
  "Advance Purchase": string;
  "Order Date": Date;
  "Departure Date": Date;
  "Arrival Date": Date;
  "Product Description": string;
  "Sales Type": string;
  "Sales Channel": string;
  "Booking Ref": string;
  Ref1?: string;
  Ref2?: string;
  "Ticket Count": number;
  "Travel days": number;
  Fare: number;
  Tax: number;
  Supplements: number;
  "Total Sales Excl VAT": number;
  "Total Sales VAT": number;
  "Total Sales Incl VAT": number;
  "Emission in tons": number;
  "Compensation amount": number;
};

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
