import * as aq from "arquero";
import Fuse from "fuse.js";
import { countryMapNE } from "../../mappings/country.name.NL";
import loadUnsdCountries from "./loadUnsdCountries";
import { EmployeeClean } from "../../../types/EmployeeClean";
import { StaffEnriched } from "./loadStaffEnriched";

const loadEmployees = async (staff: StaffEnriched[]) => {
  const unsdCodes = await loadUnsdCountries();
  const options = {
    includeScore: true,
    distance: 50,
    keys: ["Country or Area"],
  };
  const fuse = new Fuse(unsdCodes, options);

  const tb = aq
    .from(staff)
    .dedupe("mId_actual")
    .derive({
      gender: aq.escape((d: StaffEnriched) =>
        d["Geslacht"] === "M" ? "m" : "f"
      ),
      nationality: aq.escape((d: StaffEnriched) => {
        const countryString = d["Nationaliteit"];
        if (!countryString) return null;
        const searchString = countryMapNE[countryString] ?? null;
        if (!searchString) return null;
        const result = fuse.search(searchString)[0];
        if (!result) {
          return null;
        }
        return result.item["ISO-alpha3 Code"];
      }),
    })
    .rename({
      Geboortedatum: "dateOfBirth",
      "Soort Medewerker": "type",
      "Functieprofiel Omschrijving": "description",
    })
    .select("mId", "mId_actual", "dateOfBirth", "gender", "nationality");

  return tb.objects() as EmployeeClean[];
};

export default loadEmployees;
