import getContacts from "../loadContacts";
import * as aq from "arquero";
import getPhdCandidates from "../getPhdCandidates";
import { PhdCandidate } from "../../../types/PhdCandidate";

(async () => {
  const contactData = await getContacts();
  const phdData = await getPhdCandidates();

  const tb = aq.from(contactData).dedupe("itcStudentId").select("itcStudentId");
  const res = tb.objects() as { itcStudentId?: string }[];
  const contactIds = res.map((d) => d.itcStudentId).filter((d) => d);

  const missing = phdData.reduce((acc: PhdCandidate[], d) => {
    if (!d.itcStudentId) return acc;
    if (!contactIds.includes(d.itcStudentId)) acc.push(d);
    return acc;
  }, []);
  // phd candidates by itcStudentId which do not have a match by itcStudentId in contact table
  console.log(missing.map((d) => d.itcStudentId));
})();
