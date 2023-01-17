import xlsx from "xlsx";
import * as aq from "arquero";
import { ddmmyyyyToDate } from "../utilities/timeparser";

export type ContactRaw = {
  "ITC code"?: string;
  Start?: string;
  "Start Date"?: string;
  "End Date"?: string;
  Description?: string;
  Specialization?: string;
  "ITC Student No."?: string;
  UTstudentno?: null;
  "Applicant status"?: string;
  Name?: string;
  Gender?: string;
  ISONationality?: string;
  Nationality?: string;
  CountryCodeOrigin?: string;
  CountryOrigin?: string;
  "Date of Birth"?: string;
  Level?: string;
  Prog?: string;
  Dept?: null;
  ProgDept?: string;
  "Thesis Title"?: null;
  "Final Score"?: string;
  SpecialAwardMention?: string;
  FinalResult?: string;
  YearCert_Exam_Dipl?: string;
  Comments?: null;
  "Certificate No."?: string;
  "Certificate Date"?: string;
  Remarks?: null;
  SponsorCategory?: null;
  Sponsor?: null;
  APPnr?: string;
  ContactNo?: string;
  COURSENO?: string;
  Diploma?: string;
};

export type ContactClean = {
  contactId: string;
  itcStudentId?: string;
  gender: string;
  dateOfBirth: string;
  countryIsoAlpha3: string;
};

export default async function getApplicants() {
  const filePath = "./data/itc/STUDENTSALUMNIv3 (20220304).xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  }) as ContactRaw[];

  const tb = aq
    .from(data)
    .derive({
      itcStudentId: aq.escape((d: ContactRaw) =>
        d["ITC Student No."] === "[history-pre 2017]"
          ? null
          : d["ITC Student No."]
      ),
      dateOfBirth: aq.escape((d: ContactRaw) =>
        d["Date of Birth"] ? ddmmyyyyToDate(d["Date of Birth"]) : null
      ),
    })
    .rename({
      ContactNo: "contactId",
      Gender: "gender",
      "Date of Birth": "dateOfBirth",
      ISONationality: "countryIsoAlpha3",
    })
    .dedupe("contactId")
    .select(
      "contactId",
      "itcStudentId",
      "gender",
      "dateOfBirth",
      "countryIsoAlpha3"
    );

  return tb.objects() as ContactClean[];
}
