import cleanTravelData2019 from "../clean/cleanTravels2019";
import sheetToJson from "../sheetToJson";
import workbookFromXlsx from "../workbookFromXlsx";

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

export default async function loadFlights2019() {
  const filePath = "./data/itc/UT.01jan-31dec2019-ITConly.xlsx";
  const workbook = await workbookFromXlsx(filePath);
  const data = sheetToJson<Travels2019Raw[]>(workbook.worksheets[0]);
  return cleanTravelData2019(data);
}
