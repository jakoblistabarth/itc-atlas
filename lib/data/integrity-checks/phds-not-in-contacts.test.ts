import loadApplicants from "../load/loadApplicants";
import * as aq from "arquero";
import loadPhds from "../load/loadPhds";
import { PhdClean } from "../../../types/PhdClean";
import loadContactsEnriched from "../load/loadContactsEnriched";
import { describe, test, expect, beforeAll } from "@jest/globals";
import { ApplicantClean } from "../../../types/ApplicantClean";

let applicants: ApplicantClean[];
let phds: PhdClean[];

beforeAll(async () => {
  const contacts = await loadContactsEnriched();
  applicants = await loadApplicants(contacts);
  phds = await loadPhds();
}, 17000);

describe("For phds", () => {
  test.failing(
    "all itc student ids assigned to phds do also occure in the contact table",
    () => {
      const tb = aq
        .from(applicants)
        .dedupe("itcStudentId_actual")
        .select("itcStudentId_actual");
      const res = tb.objects() as { itcStudentId_actual?: string }[];
      const contactIds = res.map((d) => d.itcStudentId_actual).filter((d) => d);

      const missing = phds.slice(3).reduce((acc: PhdClean[], d) => {
        if (!d.itcStudentId) return acc;
        if (!contactIds.includes(d.itcStudentId)) acc.push(d);
        return acc;
      }, []);
      // phds by itcStudentId which do not have a match by itcStudentId in contact table
      expect(missing.length).toBe(0);
    }
  );
});
