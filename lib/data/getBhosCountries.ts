import xlsx from "xlsx";
import { BhosCountry } from "../../types/BhosCountry";

export default function getBhosCountries() {
  const filePath = "./data/static/Bhos.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  return data as BhosCountry[];
}
