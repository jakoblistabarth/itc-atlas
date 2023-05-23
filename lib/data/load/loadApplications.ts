import { ContactEnriched } from "./loadContactsEnriched";
import * as aq from "arquero";
import { ApplicationClean } from "../../../types/ApplicationClean";
import { ddmmyyyyToDate } from "../../utilities/timeparser";
import getDaysBetween from "../../utilities/getDaysBetween";

export const loadApplications = async (contacts: ContactEnriched[]) => {
  const tb = aq
    .from(contacts)
    .dedupe("APPnr", "Start Date", "End Date")
    .derive({
      statusId: (d: ContactEnriched) =>
        aq.op.substring(d["Applicant status"], 0, 2),
      enrollmentStart: aq.escape((d: ContactEnriched) =>
        d["Start Date"] ? ddmmyyyyToDate(d["Start Date"]) : null
      ),
      enrollmentEnd: aq.escape((d: ContactEnriched) =>
        d["End Date"] ? ddmmyyyyToDate(d["End Date"]) : null
      ),
      examYear: (d: ContactEnriched) =>
        aq.op.is_finite(aq.op.parse_int(d["YearCert_Exam_Dipl"], 10))
          ? aq.op.parse_int(d["YearCert_Exam_Dipl"], 10)
          : null,
      certificationDate: aq.escape((d: ContactEnriched) =>
        d["Certificate Date"] ? ddmmyyyyToDate(d["Certificate Date"]) : null
      ),
    })
    .derive({
      enrolledDays: aq.escape(
        (
          d: ContactEnriched & { enrollmentStart?: Date; enrollmentEnd?: Date }
        ) => {
          if (!d.enrollmentStart || !d.enrollmentEnd) return undefined;
          return getDaysBetween(d.enrollmentStart, d.enrollmentEnd);
        }
      ),
    })
    .rename({
      APPnr: "id",
      ContactNo: "applicantId",
      ContactNo_actual: "applicantId_actual",
      COURSENO: "courseId",
      Prog: "programmId",
      "Applicant status": "status",
      Level: "level",
      Diploma: "certificateType",
      Sponsor: "sponsor",
    })
    .select(
      "id",
      "applicantId",
      "applicantId_actual",
      "courseId",
      "programmId",
      "level",
      "statusId",
      "examYear",
      "certificateType",
      "certificationDate",
      "enrollmentStart",
      "enrollmentEnd",
      "enrolledDays",
      "sponsor"
    );

  return tb.objects() as ApplicationClean[];
};

export default loadApplications;
