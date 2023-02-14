type PurposeOfTravel =
  | "Conference"
  | "Project"
  | "Other"
  | "Workshop"
  | "Fieldwork"
  | "Consulting"
  | "Meeting"
  | "Research"
  | "Acquisition"
  | "Sabbatical"
  | undefined;

export const mapToPurposeOfTravel = (str?: string): PurposeOfTravel => {
  if (!str) return undefined;
  if (!!str.match(/conferen(ce|tie)|congre(s){1,2}|symposium|event/i))
    return "Conference";
  if (!!str.match(/workshop|training|jep|course|tmt/i)) return "Workshop";
  if (!!str.match(/project/i)) return "Project";
  if (!!str.match(/meeting|working group|committee/i)) return "Meeting";
  if (!!str.match(/field(\\s)*work|veldwerk/i)) return "Fieldwork";
  if (!!str.match(/consulting/i)) return "Consulting";
  if (!!str.match(/research|supervision/i)) return "Research";
  if (!!str.match(/sabbatical/i)) return "Sabbatical";
  if (!!str.match(/(a((cq)|(qc))u(i)*siti((on)|e))|marketing/i))
    return "Acquisition";
  return "Other";
};
