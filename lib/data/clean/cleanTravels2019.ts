import * as aq from "arquero";
import { Travels2019Raw } from "../load/loadFlights2019";
import loadUnsdCountries from "../load/loadUnsdCountries";

export type Flight2019Clean = {
  departure: string;
  arrival: string;
  country: string;
  emissions: number;
  ref1: string;
  department: number;
  ref2: string;
  airportCodes: string[];
};

const cleanTravelData2019 = async (data: any) => {
  const unsdCodes = await loadUnsdCountries();
  const tb = aq
    .from(data)
    .filter(
      (d: Travels2019Raw) =>
        d["Sales Type"] !== "Train" &&
        d["Product Description"] == "Air ticket" &&
        d.Route
    )
    .derive({
      airportCodes: (d: Travels2019Raw) => aq.op.split(d.Route, "-", 100),
      departure: (d: Travels2019Raw) =>
        aq.op.format_utcdate(d["Departure Date"], true),
      arrival: (d: Travels2019Raw) =>
        aq.op.format_utcdate(d["Arrival Date"], true),
      department: aq.escape((d: Travels2019Raw) => {
        if (!d.Ref1 || d.Ref1[2] !== "9") return undefined;
        return d.Ref1[3] === "3" ? parseInt(d.Ref1?.slice(3, 5)) : undefined;
      }),
      country: aq.escape((d: Travels2019Raw) => {
        return unsdCodes.find((c) => c["ISO-alpha2 Code"] === d.Country)?.[
          "ISO-alpha3 Code"
        ];
      }),
    })
    .rename({
      Ref1: "ref1",
      Ref2: "ref2",
      "Emission in tons": "emissions",
    })
    .select([
      "departure",
      "arrival",
      "airportCodes",
      "ref1",
      "ref2",
      "department",
      "country",
      "emissions",
    ]);

  return tb.objects() as Flight2019Clean[];
};

export default cleanTravelData2019;
