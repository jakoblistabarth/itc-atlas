import xlsx from "xlsx";
import { Data, Row } from "../../types/DataFrame";
import { cleanPhdCandiates } from "./cleanPhdCandidates";

export default async function getPhdCandidates() {
  const filePath = "./data/thematic/ITCPHDCANDIDATES.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  const cleaned = cleanPhdCandiates(data as Data<Row>);

  return cleaned;
}
