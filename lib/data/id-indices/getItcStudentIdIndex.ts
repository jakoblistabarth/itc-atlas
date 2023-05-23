import { ContactRaw } from "../load/loadContacts";
import * as aq from "arquero";
import { createId } from "@paralleldrive/cuid2";

const getItcStudentIdIndex = (contacts: ContactRaw[]) => {
  const itcStudentIds = aq
    .from(contacts)
    .rename({ "ITC Student No.": "itcStudentId_actual" })
    .dedupe("itcStudentId_actual")
    .derive({ itcStudentId: aq.escape(() => createId()) })
    // .derive({ itcStudentId: () => aq.op.row_number() })
    .objects() as {
    itcStudentId_actual: string;
    itcStudentId: string;
  }[];

  return new Map(
    itcStudentIds.map((d) => [d.itcStudentId_actual, d.itcStudentId])
  );
};

export default getItcStudentIdIndex;
