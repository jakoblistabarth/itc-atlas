import * as aq from "arquero";
import { createId } from "@paralleldrive/cuid2";
import { StaffRaw } from "../load/loadStaff";

const getEmployeeIdIndex = (staff: StaffRaw[]) => {
  const applicantIds = aq
    .from(staff)
    .rename({ Medewerker: "mId_actual" })
    .dedupe("mId_actual")
    .derive({ mId: aq.escape(() => createId()) })
    .objects() as {
    mId_actual: string;
    mId: string;
  }[];

  return new Map(applicantIds.map((d) => [d.mId_actual, d.mId]));
};

export default getEmployeeIdIndex;
