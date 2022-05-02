import Fuse from "fuse.js";
import type { Data } from "../../types/DataFrame";
import DataFrame from "../DataFrame/DataFrame";
import { mapCountries } from "../mappings/country.name.EN";
import { departmentMap } from "../mappings/departments";
import getUnsdCountries from "./getUnsdCountries";

export async function cleanPhdCandiates(phdCandidates: Data) {
  const unsdCodes = await getUnsdCountries();

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
    .mutate(
      "department1",
      (row) => departmentMap[row.Department] ?? row.Department
    )
    .mutate(
      "department2",
      (row) => departmentMap[row.DepartmentSecond] ?? row.DepartmentSecond
    )
    .mutate("graduated", (row) => {
      if (row.Graduated === null) return null;
      return row.Graduated === 0 ? false : true;
    })
    // TODO: implement renameColumn to accept an Object with multiple name pairs
    // .renameColumn({
    //   Country: "country",
    //   Department: "department1",
    //   DepartmentSecond: "department2",
    //   Sponsor: "sponsor",
    // })
    .renameColumn({ Sponsor: "sponsor" })
    .select([
      "studentID",
      "country",
      "startDate",
      "endDate",
      "department1",
      "department2",
      "sponsor",
      "graduated",
    ]);

  return output.toArray(); // TODO: type error due to generic toArray Function
}
