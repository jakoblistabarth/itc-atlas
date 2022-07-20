import xlsx from "xlsx";
import cleanAlumni from "./cleanAlumni";

export default async function getAlumni() {
  const filePath = "./data/itc/All Alumni until 2020_Anon_JMT.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  const alumni = await cleanAlumni(data);

  return alumni;
}
