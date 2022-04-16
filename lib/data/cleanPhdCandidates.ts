import Fuse from "fuse.js";
import { Data } from "../../types/DataFrame";
import DataFrame from "../DataFrame/DataFrame";
import getUnsdCodes from "./getUnsdCodes";
import { mapCountries } from "../mappings/country.name";

export async function cleanPhdCandiates(phdCandidates: Data) {
  const unsdCodes = await getUnsdCodes("countries");

  const options = {
    includeScore: true,
    distance: 50,
    keys: ["Country or Area"],
  };

  const fuse = new Fuse(unsdCodes, options);

  const output = new DataFrame(phdCandidates)
    .mutate("studentID", (row) => row.ITCStudentNo + "")
    .mutate("startDate", (row) =>
      row.PhDStart ? row.PhDStart.toISOString() : null
    )
    .mutate("endDate", (row) => (row.PhDEnd ? row.PhDEnd.toISOString() : null))
    .mutate("country", (row) => {
      const clean = row.Country ? mapCountries(row.Country) : null;
      if (!clean) return null;
      const result = fuse.search(clean)[0];
      if (!result) return null;
      return result.item["ISO-alpha3 Code"];
    })
    .dropColumn("PhDStart")
    .dropColumn("PhDEnd")
    // TODO: implement renameColumn to accept an Object with multiple name pairs
    // .renameColumn({
    //   Country: "country",
    //   Department: "department1",
    //   DepartmentSecond: "department2",
    //   Sponsor: "sponsor",
    // })
    .renameColumn({ Department: "department1" })
    .renameColumn({ DepartmentSecond: "department2" })
    .renameColumn({ Sponsor: "sponsor" })
    .select([
      "studentID",
      "country",
      "startDate",
      "endDate",
      "department1",
      "department2",
      "sponsor",
    ])
    .toArray();

  return output;
}
