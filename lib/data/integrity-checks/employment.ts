import loadStaffEnriched, { StaffEnriched } from "../load/loadStaffEnriched";
import * as aq from "arquero";

// Check for employments with invalid/faulty employment dates
(async () => {
  const tb = aq.from(await loadStaffEnriched());

  tb.filter(
    (d: StaffEnriched) =>
      aq.op.timestamp(d["Begin Datum Aanstelling"]) >=
      aq.op.timestamp(d["Einddatum Aanstelling"]),
  )
    .select(["M-Nr", "Begin Datum Aanstelling", "Einddatum Aanstelling"])
    .print(50);
})();
