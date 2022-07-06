import xlsx from "xlsx";
import cleanStaff from "./cleanStaff";

export default async function getStaff() {
  const filePath = "./data/itc/ITCHRDWH.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  return await cleanStaff(data);
}
