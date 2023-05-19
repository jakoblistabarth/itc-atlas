import loadContacts, { ContactRaw } from "./loadContacts";
import * as aq from "arquero";
import { ApplicationClean } from "../../../types/ApplicationClean";
import { ddmmyyyyToDate } from "../../utilities/timeparser";

export const loadApplications = async () => {
  const data = await loadContacts();

  const tb = aq
    .from(data)
    .dedupe("APPnr", "Start Date", "End Date")
    .derive({
      statusId: (d: ContactRaw) => aq.op.substring(d["Applicant status"], 0, 2),
      enrollmentStart: aq.escape((d: ContactRaw) =>
        d["Start Date"] ? ddmmyyyyToDate(d["Start Date"]) : null
      ),
      enrollmentEnd: aq.escape((d: ContactRaw) =>
        d["End Date"] ? ddmmyyyyToDate(d["End Date"]) : null
      ),
      examYear: (d: ContactRaw) =>
        aq.op.is_finite(aq.op.parse_int(d["YearCert_Exam_Dipl"], 10))
          ? aq.op.parse_int(d["YearCert_Exam_Dipl"], 10)
          : null,
      certificationDate: aq.escape((d: ContactRaw) =>
        d["Certificate Date"] ? ddmmyyyyToDate(d["Certificate Date"]) : null
      ),
    })
    .rename({
      APPnr: "id",
      ContactNo: "applicantId",
      COURSENO: "courseId",
      Prog: "programmId",
      "Applicant status": "status",
      Level: "level",
      Diploma: "certificateType",
      Sponsor: "sponsor",
      "Start Date": "enrollmentStart",
      "End Date": "enrollmentEnd",
    })
    .select(
      "id",
      "applicantId",
      "courseId",
      "programmId",
      "level",
      "statusId",
      "examYear",
      "certificateType",
      "certificationDate",
      "enrollmentStart",
      "enrollmentEnd",
      "sponsor"
    );

  return tb.objects() as ApplicationClean[];
};

export default loadApplications;
