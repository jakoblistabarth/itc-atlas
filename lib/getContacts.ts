import xlsx from "xlsx";
import cleanContacts from "./cleanContacts";

export default async function getContacts() {
  const filePath = "./data/STUDENTSALUMNIv3 (20220304).xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  cleanContacts(data);

  return {
    data: data[0],
  };
}
