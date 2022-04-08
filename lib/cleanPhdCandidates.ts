import { Data } from "../types/DataFrame";
import DataFrame from "./DataFrame";

export function cleanPhdCandiates(phdCandidates: Data) {
  const output = new DataFrame(phdCandidates)
    .mutate("studentID", (row) => row.ITCStudentNo + "")
    .mutate("startDate", (row) =>
      row.PhDStart ? row.PhDStart.toISOString() : null
    )
    .mutate("endDate", (row) => (row.PhDEnd ? row.PhDEnd.toISOString() : null))
    .dropColumn("PhDStart")
    .dropColumn("PhDEnd")
    // TODO: implement renameColumn to accept an Object with multiple name pairs
    // .renameColumn({
    //   Country: "country",
    //   Department: "department1",
    //   DepartmentSecond: "department2",
    //   Sponsor: "sponsor",
    // })
    .renameColumn({ Country: "country" })
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
