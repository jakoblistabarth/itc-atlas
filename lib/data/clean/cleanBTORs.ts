import * as aq from "arquero";
import Fuse from "fuse.js";
import { mapCountries } from "../../mappings/country.name.EN";
import { mapToDepartment } from "../../mappings/departments";
import { mapToPurposeOfTravel } from "../../mappings/purposeoftravel";
import { BtorRaw } from "../load/loadBtors";
import loadCountries from "../load/loadUnsdCountries";

type BtorClean = {
  id: number;
  start: string;
  end: string;
  year: number;
  countries: string[];
  purpose: string;
  budgetId: string;
  department: string;
};

const cleanBTORs = async (data: BtorRaw[]) => {
  const unsdCodes = await loadCountries();

  const fuseOptions = {
    includeScore: true,
    distance: 50,
    keys: ["Country or Area"],
  };
  const fuse = new Fuse(unsdCodes, fuseOptions);

  const output = aq
    .from(data)
    .derive({
      start: aq.escape((d: BtorRaw) => d.Departure.toISOString()),
      end: aq.escape((d: BtorRaw) => d.Return.toISOString()),
      department: aq.escape((d: BtorRaw) => mapToDepartment(d.Dept)),
      purpose: aq.escape((d: BtorRaw) =>
        mapToPurposeOfTravel(d["Purpose of travel"])
      ),
      countries: aq.escape((d: BtorRaw) => {
        const split = d.Destination.replace(
          /,\s(?<suffix>\w*\s(?:State|Republic) of)/gi,
          " ($<suffix>)" // replace commas in names with enclosing parentheses
        ).split(/(?:,|\/)\s?/); // split by commas or backslashes
        return split
          .map((d) => mapCountries(d))
          .flatMap((d) => {
            const result = fuse.search(d)[0];
            if (!result) return [];
            return [result.item["ISO-alpha3 Code"]];
          });
      }),
    })
    .rename({
      Year: "year",
      ID: "id",
      Destination: "destination",
      "Purpose of travel": "purposeRaw",
      Budget: "budgetId",
    })
    .select([
      "id",
      "start",
      "end",
      "year",
      "countries",
      "destination",
      "purpose",
      "budgetId",
      "department",
    ]);

  return output.objects() as BtorClean[];
};

export default cleanBTORs;
