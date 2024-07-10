import * as aq from "arquero";
import Fuse from "fuse.js";
import { PhdClean } from "../../../types/PhdClean";
import { mapCountries } from "../../mappings/country.name.EN";
import { mapToDepartment } from "../../mappings/departments";
import { PhdRaw } from "../load/loadPhds";
import loadCountries from "../load/loadUnsdCountries";

export async function cleanPhds(data: PhdRaw[]) {
  const unsdCodes = await loadCountries();

  const fuseOptions = {
    includeScore: true,
    distance: 50,
    keys: ["Country or Area"],
  };
  const fuse = new Fuse(unsdCodes, fuseOptions);

  const tb = aq
    .from(data)
    .derive({
      thesisTitle: aq.escape((d: PhdRaw) =>
        d.TitlePure && d.TitlePure != "0" ? d.TitlePure : d.Thesis_Title,
      ),
      itcStudentId: aq.escape((d: PhdRaw) =>
        d.ITCStudentNo ? d.ITCStudentNo + "" : undefined,
      ),
      dateStart: aq.escape((d: PhdRaw) => (d?.PhDStart ? d.PhDStart : null)),
      dateGraduation: aq.escape((d: PhdRaw) =>
        d?.SISGraduated ? d.SISGraduated : null,
      ),
      yearPromotion: aq.escape((d: PhdRaw) =>
        d?.Promotion && d?.Promotion > 1950 ? d.Promotion : null,
      ),
      country: aq.escape((d: PhdRaw) => {
        const clean = d?.Country ? mapCountries(d.Country) : null;
        if (!clean) return null;
        const result = fuse.search(clean)[0];
        if (!result) return null;
        return result.item["ISO-alpha3 Code"];
      }),
      departmentsMain: aq.escape((d: PhdRaw) => {
        return mapToDepartment(d.Department);
      }),
      doi: (d: PhdRaw) => aq.op.replace(d.DOI, /\\$/, ""),
      status: (d: PhdRaw) =>
        aq.op.padstart(d.LastStatus ? d.LastStatus + "" : "00", 2, "0"),
    })
    .derive({
      departmentsSecondary: aq.escape(
        (d: PhdRaw & { departmentsMain?: string }) => {
          const dep2 = mapToDepartment(d.DepartmentSecond);
          return dep2
            ? dep2?.filter(
                (departmentSecondary) =>
                  !d.departmentsMain?.includes(departmentSecondary),
              )
            : null;
        },
      ),
    })
    .rename({
      Country: "country",
      Sponsor: "sponsor",
      NamePure: "name",
      Dissertation_Number: "dissertationNumber",
    })
    .select(
      "itcStudentId",
      "country",
      "departmentsMain",
      "departmentsSecondary",
      "sponsor",
      "status",
      "dateStart",
      "dateGraduation",
      "yearPromotion",
      "dissertationNumber",
      "thesisTitle",
      "doi",
      "name",
    );

  return tb.objects() as PhdClean[];
}
