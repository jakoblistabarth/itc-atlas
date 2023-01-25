import * as aq from "arquero";
import loadStaff, { StaffRaw } from "./loadStaff";
import { EmploymentClean } from "../../../types/EmploymentClean";

const loadEmployments = async () => {
  const staff = await loadStaff();
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

export default loadEmployments;
