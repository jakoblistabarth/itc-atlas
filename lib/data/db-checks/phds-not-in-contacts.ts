import loadApplicants from "../load/loadApplicants";
import * as aq from "arquero";
import loadPhds from "../load/loadPhds";
import { Phd } from "../../../types/Phd";

(async () => {
  const contactData = await loadApplicants();
  const phdData = await loadPhds();

  const tb = aq.from(contactData).dedupe("itcStudentId").select("itcStudentId");
  const res = tb.objects() as { itcStudentId?: string }[];
  const contactIds = res.map((d) => d.itcStudentId).filter((d) => d);

  const missing = phdData.reduce((acc: Phd[], d) => {
    if (!d.itcStudentId) return acc;
    if (!contactIds.includes(d.itcStudentId)) acc.push(d);
    return acc;
  }, []);
  // phds by itcStudentId which do not have a match by itcStudentId in contact table
  console.log(missing.map((d) => d.itcStudentId));
})();
