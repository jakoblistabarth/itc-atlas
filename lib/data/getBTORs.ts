import xlsx from "xlsx";
import cleanBTORs from "./cleanBTORs";

export default async function getBTORs() {
  const filePath = "./data/itc/BACKTOOFFICEREPORTS.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  const btors = cleanBTORs(data);

  return btors;
}
