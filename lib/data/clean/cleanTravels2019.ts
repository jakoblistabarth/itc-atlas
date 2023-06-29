import * as aq from "arquero";
import { Travels2019Raw } from "../load/loadFlights2019";
import loadUnsdCountries from "../load/loadUnsdCountries";
import { Flight2019Type } from "@prisma/client";

export type Flight2019Clean = {
  departure: string;
  arrival: string;
  country: string;
  emissions: number;
  department: number;
  type?: Flight2019Type;
  airportCodes: string[];
};

const cleanTravelData2019 = async (data: Travels2019Raw[]) => {
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
      type: aq.escape((d: Travels2019Raw) => {
        if (d["Ref2"] === "8500" || d["Ref2"] === "8561")
          return Flight2019Type.StudentPhdRelated;
        if (!d["Ref1"]) return;
        if (d["Ref1"].match(/^939/)) return Flight2019Type.ProjectRelated;
        if (d["Ref1"].match(/^930/)) return Flight2019Type.NonProjectRelated;
      }),
      country: aq.escape((d: Travels2019Raw) => {
        return unsdCodes.find((c) => c["ISO-alpha2 Code"] === d.Country)?.[
          "ISO-alpha3 Code"
        ];
      }),
    })
    .rename({
      "Emission in tons": "emissions",
    })
    .select([
      "departure",
      "arrival",
      "airportCodes",
      "department",
      "type",
      "country",
      "emissions",
    ]);

  return tb.objects() as Flight2019Clean[];
};

export default cleanTravelData2019;
