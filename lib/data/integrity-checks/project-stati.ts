import loadBtors from "../load/loadProjects";
import * as aq from "arquero";

(async () => {
  const btors = await loadBtors();
  const tb = aq.from(btors);
  console.table(
    tb.groupby("status").count().orderby(aq.desc("count")).objects(),
  );
})();
