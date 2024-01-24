import * as aq from "arquero";
import { EmploymentClean } from "../../../types/EmploymentClean";
import { mapToDepartment } from "../../mappings/departments";
import { StaffEnriched } from "./loadStaffEnriched";
import getDaysBetween from "../../utilities/getDaysBetween";

const loadEmployments = async (staff: StaffEnriched[]) => {
  const tb = aq
    .from(staff)
    .derive({
      departments: aq.escape((d: StaffEnriched) =>
        d["Organisatiecode"]
          ? mapToDepartment(d["Organisatiecode"].replace(/ITC-/, ""))
          : null,
      ),
      startYear: (d: StaffEnriched) => aq.op.year(d["Begin Datum Aanstelling"]),
      endYear: (d: StaffEnriched) => aq.op.year(d["Einddatum Aanstelling"]),
      unitEndYear: (d: StaffEnriched) =>
        aq.op.year(d["Datum Einde dienstverband Eenheid"]),
      employedDays: aq.escape((d: StaffEnriched) => {
        if (!d["Begin Datum Aanstelling"] || !d["Einddatum Aanstelling"])
          return undefined;
        return getDaysBetween(
          d["Begin Datum Aanstelling"],
          d["Einddatum Aanstelling"],
        );
      }),
    })
    .rename({
      "Soort Medewerker": "type",
      "Functieprofiel Omschrijving": "description",
    })
    .select(
      "mId",
      "mId_actual",
      "startYear",
      "endYear",
      "unitEndYear",
      "employedDays",
      "departments",
      "type",
      "description",
    );

  return tb.objects() as EmploymentClean[];
};

export default loadEmployments;
