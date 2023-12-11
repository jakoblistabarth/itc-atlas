import loadPhds from "../load/loadPhds";
import * as aq from "arquero";

(async () => {
  const phds = await loadPhds();
  const tb = aq.from(phds);
  //@ts-expect-error purposely filter out titles with an integer value
  const res = tb.filter((d: PhdClean) => d.thesisTitle == 0).objects();
  console.table(res);
})();
