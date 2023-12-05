import loadBtors from "../load/loadBtors";
import * as aq from "arquero";

(async () => {
  const btors = await loadBtors();
  const tb = aq.from(btors);
  console.table(
    tb.groupby("department").count().orderby(aq.desc("count")).objects(),
  );
})();
