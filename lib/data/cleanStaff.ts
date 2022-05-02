import { Staff } from "../../types/Staff";
import DataFrame from "../DataFrame/DataFrame";
import Fuse from "fuse.js";
import { countryMapNE } from "../mappings/country.name.NL";
import getUnsdCountries from "./getUnsdCountries";

const cleanStaff = async (staff: any): Promise<Staff[]> => {
  const unsdCodes = await getUnsdCountries();
  const options = {
    includeScore: true,
    distance: 50,
    keys: ["Country or Area"],
  };
  const fuse = new Fuse(unsdCodes, options);

  const df = new DataFrame(staff)
    .mutate("dateOfBirth", (row) =>
      row["Geboortedatum"] ? row["Geboortedatum"].toISOString() : null
    )
    .mutate("employmentStart", (row) =>
      row["Begin Datum Aanstelling"]
        ? row["Begin Datum Aanstelling"].toISOString()
        : null
    )
    .mutate("employmentEnd", (row) =>
      row["Einddatum Aanstelling"]
        ? row["Einddatum Aanstelling"].toISOString()
        : null
    )
    .mutate("employmentUnitEnd", (row) =>
      row["Datum Einde dienstverband Eenheid"]
        ? row["Datum Einde dienstverband Eenheid"].toISOString()
        : null
    )
    .mutate("gender", (row) => {
      if (!row["Geslacht"]) return null;
      return row["Geslacht"] === "M" ? "m" : "f";
    })
    .mutate("nationality", (row) => {
      const countryString = row["Nationaliteit"];
      if (!countryString) return null;
      const searchString = countryMapNE[countryString] ?? null;
      if (!searchString) return null;
      const result = fuse.search(searchString)[0];
      if (!result) {
        return null;
      }
      return result.item["ISO-alpha3 Code"];
    })
    .mutate(
      "organisation",
      (row) => row["Organisatiecode"].replace(/ITC-*/, "") ?? null
    )
    .mutate("department", (row) => {
      const department = row["Leerstoel / afdeling"];
      return department ? department.replace(/ITC-*/, "") : null;
    })
    .renameColumn({ "Soort Medewerker": "type" })
    .renameColumn({ "Functieprofiel Omschrijving": "description" })
    .select([
      "dateOfBirth",
      "employmentStart",
      "employmentEnd",
      "employmentUnitEnd",
      "gender",
      "nationality",
      "organisation",
      "department",
      "type",
      "description",
    ]);

  return df.toArray();
};

export default cleanStaff;
