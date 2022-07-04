import DataFrame from "../DataFrame/DataFrame";
import { Applicant } from "../../types/Applicant";
import { ddmmyyyyToDate } from "./timeparser";

export default async function cleanApplicants(
  input: unknown[]
): Promise<Applicant[]> {
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
    .mutate("startDate", (row) => {
      const value = row["Start Date"];
      if (!value) return null;
      return ddmmyyyyToDate(value).toISOString();
    })
    .mutate("endDate", (row) => {
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

  // return applicants.toArray().map((row) => ({
  //   dateOfBirth: row.dateOfBirth?.toString(),
  //   startDate,
  //   endDate,
  //   description,
  //   specialization,
  //   gender,
  //   nationality,
  //   countryOrigin,
  //   level,
  //   prog,
  //   dept,
  //   progDept,
  //   specialAwardMention,
  //   sponsor,
  //   sponsorCategory,
  //   courseNo,
  //   diploma,
  //   certificateDate,
  //   yearCertExamDipl,
  //   finalResult,
  //   finalScore,
  //   applicantStatus,
  //   thesisTitle,
  //   itcCode,
  // }));
}
