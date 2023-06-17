import workbookFromXlsx from "../workbookFromXlsx";
import sheetToJson from "../sheetToJson";

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
  Comments?: string;
  "Certificate No."?: string;
  "Certificate Date"?: string;
  Remarks?: string;
  SponsorCategory?: string;
  Sponsor?: string;
  APPnr?: string;
  ContactNo?: string;
  COURSENO?: string;
  Diploma?: string;
};

const loadContacts = async () => {
  const filePath = "./data/itc/STUDENTSALUMNIv4 (20230217).xlsx";
  const workbook = await workbookFromXlsx(filePath);
  return sheetToJson<ContactRaw[]>(workbook.worksheets[0]);
};

export default loadContacts;
