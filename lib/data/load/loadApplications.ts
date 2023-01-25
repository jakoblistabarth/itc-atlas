import loadContacts, { ContactRaw } from "./loadContacts";
import * as aq from "arquero";
import { ApplicationClean } from "../../../types/ApplicationClean";
import { ddmmyyyyToDate } from "../../utilities/timeparser";

export const loadApplications = async () => {
  const data = await loadContacts();

  const tb = aq
    .from(data)
    .derive({
      statusId: (d: ContactRaw) => aq.op.substring(d["Applicant status"], 0, 2),
      enrollmentStart: aq.escape((d: ContactRaw) =>
        d["Start Date"] ? ddmmyyyyToDate(d["Start Date"]) : null
      ),
      enrollmentEnd: aq.escape((d: ContactRaw) =>
        d["End Date"] ? ddmmyyyyToDate(d["End Date"]) : null
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
      "statusId",
      "level",
      "certificateType",
      "enrollmentStart",
      "enrollmentEnd", //TODO: add certificationDate?
      "sponsor"
    );

  return tb.objects() as ApplicationClean[];
};

export default loadApplications;
