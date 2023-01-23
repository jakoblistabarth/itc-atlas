import * as aq from "arquero";
import { StaffRaw } from "./getStaff";
import { EmploymentClean } from "../../types/EmploymentClean";

const cleanEmployees = async (staff: StaffRaw[]) => {
  const tb = aq
    .from(staff)
    .derive({
      mId: aq.escape((d: StaffRaw) => parseInt(d["Medewerker"], 10)),
      organisation: aq.escape((d: StaffRaw) =>
        d["Organisatiecode"] ? d["Organisatiecode"].replace(/ITC-*/, "") : null
      ),
      department: aq.escape((d: StaffRaw) =>
        d["Organisatiecode"] ? d["Organisatiecode"].replace(/ITC-*/, "") : null
      ),
    })
    .rename({
      "Soort Medewerker": "type",
      "Functieprofiel Omschrijving": "description",
      "Begin Datum Aanstelling": "employmentStart",
      "Einddatum Aanstelling": "employmentEnd",
      "Datum Einde dienstverband Eenheid": "employmentUnitEnd",
    })
    .select(
      "mId",
      "employmentStart",
      "employmentEnd",
      "employmentUnitEnd",
      "organisation",
      "department",
      "type",
      "description"
    );

  return tb.objects() as EmploymentClean[];
};

export default cleanEmployees;
