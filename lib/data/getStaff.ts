import xlsx from "xlsx";
import cleanStaff from "./cleanStaff";

export default async function getStaff() {
  const filePath = "./data/ITCHRDWH.xlsx";
  const file = xlsx.readFile(filePath, {
    cellDates: true,
  });
  const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    defval: null,
  });

  const staff = cleanStaff(data);

  return staff.map(
    ({
      ["Geboortedatum"]: dateOfBirth,
      ["Einddatum Aanstelling"]: employmentEnd,
      ["Begin Datum Aanstelling"]: employmentStart,
      ["Datum Einde dienstverband Eenheid"]: employmentUnitEnd,
      ["Geslacht"]: gender,
      ["Nationaliteit"]: nationality,
    }) => ({
      dateOfBirth,
      employmentEnd,
      employmentStart,
      employmentUnitEnd,
      gender,
      nationality,
    })
  );
}
