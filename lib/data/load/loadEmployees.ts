import * as aq from "arquero";
import Fuse from "fuse.js";
import { countryMapNE } from "../../mappings/country.name.NL";
import getUnsdCountries from "./loadUnsdCountries";
import loadStaff, { StaffRaw } from "../load/loadStaff";
import { EmployeeClean } from "../../../types/EmployeeClean";

const loadEmployees = async () => {
  const staff = await loadStaff();
  const unsdCodes = await getUnsdCountries();
  const options = {
    includeScore: true,
    distance: 50,
    keys: ["Country or Area"],
  };
  const fuse = new Fuse(unsdCodes, options);

  const tb = aq
    .from(staff)
    .dedupe("Medewerker")
    .derive({
      mId: aq.escape((d: StaffRaw) => parseInt(d["Medewerker"], 10)),
      gender: aq.escape((d: StaffRaw) => (d["Geslacht"] === "M" ? "m" : "f")),
      nationality: aq.escape((d: StaffRaw) => {
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
      organisation: aq.escape((d: StaffRaw) =>
        d["Organisatiecode"] ? d["Organisatiecode"].replace(/ITC-*/, "") : null
      ),
      department: aq.escape((d: StaffRaw) =>
        d["Organisatiecode"] ? d["Organisatiecode"].replace(/ITC-*/, "") : null
      ),
    })
    .rename({
      Geboortedatum: "dateOfBirth",
      "Soort Medewerker": "type",
      "Functieprofiel Omschrijving": "description",
      "Begin Datum Aanstelling": "employmentStart",
      "Einddatum Aanstelling": "employmentEnd",
      "Datum Einde dienstverband Eenheid": "employmentUnitEnd",
    })
    .select(
      "mId",
      "dateOfBirth",
      "employmentStart",
      "employmentEnd",
      "employmentUnitEnd",
      "gender",
      "nationality",
      "organisation",
      "department",
      "type",
      "description"
    );

  return tb.objects() as EmployeeClean[];
};

export default loadEmployees;
