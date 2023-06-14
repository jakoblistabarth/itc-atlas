import loadApplications from "../load/loadApplications";
import * as aq from "arquero";
import loadContactsEnriched from "../load/loadContactsEnriched";
import workbookFromXlsx from "../workbookFromXlsx";
import sheetToJson from "../sheetToJson";

(async () => {
  const contacts = await loadContactsEnriched();
  const applications = await loadApplications(contacts);
  const tb = aq.from(applications);
  const countContacts = tb.groupby("examYear").count();

  const filePath = "./data/itc/All Alumni until 2020_Anon_JMT.xlsx";
  const workbook = await workbookFromXlsx(filePath);
  const alumni = sheetToJson<any>(workbook.worksheets[0]);
  const tb2 = aq.from(alumni);
  const countAlumni = tb2.groupby("Exam Year").count();

  const join = countContacts.join_full(countAlumni, ["examYear", "Exam Year"]);
  console.table(
    join.select(aq.not("Exam Year")).orderby(aq.desc("examYear")).objects()
  );
})();
