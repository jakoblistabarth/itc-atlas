import xlsx from "xlsx";

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

const loadContacts = async () => {
  const filePath = "./data/itc/STUDENTSALUMNIv4 (20230217).xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  return xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  }) as ContactRaw[];
};

export default loadContacts;
