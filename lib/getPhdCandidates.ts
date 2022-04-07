import xlsx from "xlsx";
import { cleanPhdCandiates } from "./cleanPhdCandidates";

export default async function getPhdCandidates() {
  const filePath = "./data/ITCPHDCANDIDATES.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  const cleaned = cleanPhdCandiates(data);

  return cleaned;
}
