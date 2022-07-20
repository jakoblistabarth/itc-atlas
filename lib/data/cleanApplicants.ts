import DataFrame from "../DataFrame/DataFrame";
import { Applicant } from "../../types/Applicant";
import getAlumni from "../../lib/data/getAlumni";
import { ddmmyyyyToDate } from "../utilities/timeparser";

export default async function cleanApplicants(
  input: unknown[]
): Promise<Applicant[]> {
  const alumni = await getAlumni();
  const applicants = new DataFrame(input)
    .where(
      (row) =>
        !row["Applicant status"].slice(5).match(/^(Not)|(Rejected)|(Cancelled)/)
    )
    .mutate("dateOfBirth", (row) => {
      const value = row["Date of Birth"];
      if (!value) return null;
      return ddmmyyyyToDate(value).toISOString();
    })
    .mutate("dateStart", (row) => {
      const value = row["Start Date"];
      if (!value) return null;
      return ddmmyyyyToDate(value).toISOString();
    })
    .mutate("dateEnd", (row) => {
      const value = row["End Date"];
      if (!value) return null;
      return ddmmyyyyToDate(value).toISOString();
    })
    .mutate("certificateDate", (row) => {
      const value = row["Certificate Date"];
      if (!value) return null;
      const date = ddmmyyyyToDate(value);
      return date > new Date("1949") ? date.toISOString() : null;
    })
    .mutate("yearCertExamDipl", (row) => {
      const date = row["YearCert_Exam_Dipl"];
      if (!date) return null;
      return new Date(date) > new Date("1949")
        ? new Date(date).toISOString()
        : null;
    })
    .mutate("city", (row) => {
      const match = alumni.find((d) => d.contactNo === row["ContactNo"]);
      if (!match) return null;
      return match.city ?? null;
    })
    .dropColumn([
      "Name",
      "UTstudentno",
      "ITC Student No.",
      "ContactNo",
      "CountryCodeOrigin",
      "ISONationality",
      "Remarks",
      "Comments",
      "APPnr",
      "Certificate No.",
      "Certificate Date",
      "YearCert_Exam_Dipl",
      "Date of Birth",
      "Start Date",
      "End Date",
    ])
    .renameColumn({ Start: "start" })
    .renameColumn({ Description: "description" })
    .renameColumn({ Specialization: "specialization" })
    .renameColumn({ Gender: "gender" })
    .renameColumn({ Nationality: "nationality" })
    .renameColumn({ CountryOrigin: "countryOrigin" })
    .renameColumn({ Level: "level" })
    .renameColumn({ Prog: "prog" })
    .renameColumn({ Dept: "dept" })
    .renameColumn({ ProgDept: "progDept" })
    .renameColumn({ SpecialAwardMention: "specialAwardMention" })
    .renameColumn({ Sponsor: "sponsor" })
    .renameColumn({ SponsorCategory: "sponsorCategory" })
    .renameColumn({ COURSENO: "courseNo" })
    .renameColumn({ Diploma: "diploma" })
    .renameColumn({ FinalResult: "finalResult" })
    .renameColumn({ "Final Score": "finalScore" })
    .renameColumn({ "Applicant status": "applicantStatus" })
    .renameColumn({ "Thesis Title": "thesisTitle" })
    .renameColumn({ "ITC code": "itcCode" });

  return applicants.toArray() as Applicant[]; //Question: better to make a explicit mapping?
}
