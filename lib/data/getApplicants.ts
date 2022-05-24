import xlsx from "xlsx";
import cleanApplicants from "./cleanApplicants";

export default async function getApplicants() {
  const filePath = "./data/thematic/STUDENTSALUMNIv3 (20220304).xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  const ApplicantsClean = await cleanApplicants(data);

  return ApplicantsClean;
}
