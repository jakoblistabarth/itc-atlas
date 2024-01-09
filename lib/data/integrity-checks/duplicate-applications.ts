import loadContactsEnriched from "../load/loadContactsEnriched";
import * as aq from "arquero";

type GroupByAppNrCount = { count: number; APPnr: string };

(async () => {
  const tb = aq.from(await loadContactsEnriched());

  const res = tb
    .groupby("APPnr")
    .count()
    .filter((d: GroupByAppNrCount) => d.count > 1)
    .array("APPnr");

  const log = tb
    .filter(aq.escape((d: GroupByAppNrCount) => res.includes(d.APPnr)))
    .select(
      "APPnr",
      // "Start Date",
      // "End Date",
      "Certificate Date"
      // "FinalResult",
      // "Applicant status",
      // "COURSENO",
      // "Level"
      //   "ContactNo"
    )
    .objects();
  console.table(log);
})();
