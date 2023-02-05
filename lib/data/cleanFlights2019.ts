import { Flight } from "../../types/Travels";
import * as aq from "arquero";
import { Travels2019Raw } from "./getFlights2019";

const cleanTravelData2019 = (data: any) => {
  const tb = aq
    .from(data)
    .filter(
      (row: Travels2019Raw) =>
        row["Sales Type"] !== "Train" &&
        row["Product Description"] == "Air ticket" &&
        row.Route
    )
    .derive({
      airportCodes: (d: Travels2019Raw) => aq.op.split(d.Route, "-", 100),
      orderDate: (d: Travels2019Raw) =>
        aq.op.format_date(d["Order Date"], true),
      departureDate: (d: Travels2019Raw) =>
        aq.op.format_date(d["Departure Date"], true),
      arrivalDate: (d: Travels2019Raw) =>
        aq.op.format_date(d["Arrival Date"], true),
      travelDays: (d: Travels2019Raw) => aq.op.abs(d["Travel days"]),
    })
    .rename({ Ref1: "ref1", Ref2: "ref2", Route: "route" })
    .select([
      "orderDate",
      "departureDate",
      "arrivalDate",
      "airportCodes",
      "travelDays",
      "ref1",
      "ref2",
    ]);

  return tb.objects() as Flight[];
};

export default cleanTravelData2019;
