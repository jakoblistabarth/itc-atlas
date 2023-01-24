import loadContacts, { ContactRaw } from "./loadContacts";
import * as aq from "arquero";
import { ApplicationClean } from "../../../types/ApplicationClean";

export const loadApplications = async () => {
  const data = await loadContacts();

  const tb = aq
    .from(data)
    .derive({
      statusId: (d: ContactRaw) => aq.op.substring(d["Applicant status"], 0, 2),
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
      "sponsor"
    );

  return tb.objects() as ApplicationClean[];
};

export default loadApplications;
