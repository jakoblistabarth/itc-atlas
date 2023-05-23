import loadApplications from "../load/loadApplications";
import * as aq from "arquero";
import xlsx from "xlsx";
import loadContactsEnriched from "../load/loadContactsEnriched";

(async () => {
  const contacts = await loadContactsEnriched();
  const applications = await loadApplications(contacts);
  const tb = aq.from(applications);
  const countContacts = tb.groupby("examYear").count();

  const filePath = "./data/itc/All Alumni until 2020_Anon_JMT.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const alumni = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });
  const tb2 = aq.from(alumni);
  const countAlumni = tb2.groupby("Exam Year").count();

  const join = countContacts.join_full(countAlumni, ["examYear", "Exam Year"]);
  console.table(
    join.select(aq.not("Exam Year")).orderby(aq.desc("examYear")).objects()
  );
})();
