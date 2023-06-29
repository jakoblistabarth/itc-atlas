import { ContactRaw } from "../load/loadContacts";
import * as aq from "arquero";
import { createId } from "@paralleldrive/cuid2";

const getApplicantIdIndex = (contacts: ContactRaw[]) => {
  const applicantIds = aq
    .from(contacts)
    .rename({ ContactNo: "applicantId_actual" })
    .dedupe("applicantId_actual")
    .derive({ applicantId: aq.escape(() => createId()) })
    // .derive({ applicantId: () => aq.op.row_number() })
    .objects() as {
    applicantId_actual: string;
    applicantId: string;
  }[];

  return new Map(
    applicantIds.map((d) => [d.applicantId_actual, d.applicantId])
  );
};

export default getApplicantIdIndex;
