import xlsx from "xlsx";
import { NfpCountry } from "../../types/NfpCountry";

export default function getNfpCountries() {
  const filePath = "./data/static/nfpCountries.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  return data as NfpCountry[];
}
