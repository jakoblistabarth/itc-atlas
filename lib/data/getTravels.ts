import xlsx from "xlsx";
import cleanTravels from "./cleanTravels";

export default async function getTravels() {
  const filePath = "./data/itc/TRAVELDETAILS.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });
  const travels = cleanTravels(data);

  return travels;
}
