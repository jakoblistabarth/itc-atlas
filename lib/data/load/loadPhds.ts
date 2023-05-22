import xlsx from "xlsx";
import { cleanPhds } from "../clean/cleanPhds";

export type PhdRaw = {
  ITCStudentNo?: number;
  mnumber?: number;
  Surname?: string;
  PhDStart?: Date;
  PhDEnd?: Date;
  NumberOfPhDTrajectories?: number;
  FirstStatus?: number;
  LastStatus?: number;
  ThemePromotorStart?: string;
  ThemePromotor?: string;
  SISPromotion?: number;
  SISDissertation_Number?: string;
  SISISBN?: string;
  SISGraduated?: Date;
  PhdId?: number;
  Registration_no?: number;
  Title?: string;
  ITC_Staff?: number;
  Last_Name?: string;
  Country?: string;
  ResearchTheme?: string;
  Thesis_Title?: string;
  Promotion?: number;
  Dissertation_Number?: number;
  ISBN?: string;
  Graduated?: number;
  Upnr?: string;
  CourseCode?: string;
  CourseCodeSecond?: string;
  Department?: string;
  DepartmentSecond?: string;
  Sponsor?: string;
  SpecialMention?: string;
};

export default async function loadPhds() {
  const filePath = "./data/itc/ITCPHDCANDIDATES.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  }) as PhdRaw[];

  const cleaned = cleanPhds(data);
  return cleaned;
}
