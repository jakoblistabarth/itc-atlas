import xlsx from "xlsx";
import cleanProjects, { ProjectClean } from "../clean/cleanProjects";

export type ProjectPre2019Raw = {
  Project_ID: string;
  "Project Number": string;
  "Project name": string;
  "Project name in short": string;
  Country: string;
  "Project type": string;
  "Project status": string;
  Result: string;
  "Next action": string;
  Remarks: string;
  "Project summary": string;
  "Consulting services": string;
  "Procurement of goods": string;
  "Description of developments": string;
  "First listing": string;
  "Last update": string;
  "Starting date": string;
  "Completion date": string;
  "Shortlisting date": string;
  "Letter of Interest date": string;
  "Letter of Interest reference": string;
  "Prequalification  date": string;
  "Proposal invitation date": string;
  "Deadline of submission": string;
  "Submission date": string;
  "Evaluation date": string;
  "Pre contract agreement date": string;
  "Contract date client": string;
  "Contract date ITC": string;
  "Reporting milestones": string;
  "Funding type": string;
  "Tender type": string;
  "Percentage covered by ITC": string;
  "Percentage covered by partner(s)": string;
  Division: string;
  "Project officer": string;
  "Project supervisor": string;
  "Number of ITC staff involved": string;
  "Number of man months ITC": string;
  "Number of man months partner(s)": string;
  "Project administrator": string;
  "Project secretary": string;
  "Currency code": string;
  "Exchange rate": string;
  "Contribution funding agency": string;
  "Partner share contract value": string;
  "ITC share contract value": string;
  "Personmonths abroad": string;
  "Personmonths in NL": string;
  "Student months abroad": string;
  "Student months in NL": string;
  "Total project budget": string;
  "Total ITC budget": string;
  "Sub contractor budget": string;
  "Consulting budget": string;
  "Value other expenses": string;
  "Last invoice date": string;
  "Invoicing milestones": string;
  ExternalSite: string;
};

export type ProjectPost2019Raw = {
  projectID: string;
  projectName: string;
  projectShortName: string;
  ProposalType: string;
  projecttype: string;
  Status: string;
  OFIno: string;
  VOCAno: string;
  vocaYN: string;
  dateVOCA: string;
  RemarksVOCA: string;
  CountriesRegion: string;
  Client_FundingAgency: string;
  LeadOrganisation: string;
  Partners: string;
  LeadDepartment: string;
  OtherDepartments: string;
  dateStartProposal: Date;
  dateEndProposal: Date;
  POproposal: string;
  PLproposal: string;
  PAproposal: string;
  dateDeadlineSubmission: Date;
  dateExpectedResponse: Date;
  budgetEURsubm: number;
  ITCbudgetEURsubm: string;
  CMEURsubm: string;
  dateSubmission: string;
  dateAwarded: string;
  PO: string;
  PL: string;
  PA: string;
  PS: string;
  budgetEUR: string;
  ITCbudgetEUR: string;
  CMEUR: string;
  dateStart: string;
  dateEnd: string;
  RemarksRejected: string;
  dateCompleted: string;
  ProjectReference: string;
  RemarksCompleted: string;
  descriptionProject: string;
  URL: string;
  Delegate: string;
  dateCreated: string;
  dateModified: string;
  ModifiedBy: string;
  Remarks: string;
  Goals: string;
  textsearch: string;
  GeldstroomCategory: string;
  FundingProgramme: string;
};

export default async function loadProjects(): Promise<ProjectClean[]> {
  const filePath = "./data/itc/ITCPROJECTS (V2_20230217).xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const sheetNames = file.SheetNames;
  const projectsPre2019 = xlsx.utils.sheet_to_json(
    file.Sheets[sheetNames[1]]
  ) as unknown as ProjectPre2019Raw;
  const projectsPost2019 = xlsx.utils.sheet_to_json(
    file.Sheets[sheetNames[0]]
  ) as unknown as ProjectPost2019Raw;

  return await cleanProjects({ projectsPre2019, projectsPost2019 });
}