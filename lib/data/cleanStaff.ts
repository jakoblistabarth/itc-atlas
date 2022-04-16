import { Staff } from "../types/Staff";
import { Row } from "../types/DataFrame";

const cleanStaff = (staff: Row[]): Staff[] => {
  staff.forEach((row) => {
    row["Geboortedatum"] = row["Geboortedatum"]
      ? row["Geboortedatum"].toISOString()
      : null;
    row["Begin Datum Aanstelling"] = row["Begin Datum Aanstelling"]
      ? row["Begin Datum Aanstelling"].toISOString()
      : null;
    row["Einddatum Aanstelling"] = row["Einddatum Aanstelling"]
      ? row["Einddatum Aanstelling"].toISOString()
      : null;
    row["Datum Einde dienstverband Eenheid"] = row[
      "Datum Einde dienstverband Eenheid"
    ]
      ? row["Datum Einde dienstverband Eenheid"].toISOString()
      : null;
  });
  return staff;
};

export default cleanStaff;
