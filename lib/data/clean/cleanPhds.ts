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
      department1: aq.escape((d: PhdRaw) => {
        return mapToDepartment(d.Department);
      }),
      department2: aq.escape((d: PhdRaw) => {
        return mapToDepartment(d.DepartmentSecond);
      }),
      doi: (d: PhdRaw) => aq.op.replace(d.DOI, /\\$/, ""),
      status: (d: PhdRaw) =>
        aq.op.padstart(d.LastStatus ? d.LastStatus + "" : "00", 2, "0"),
    })
    .rename({
      Country: "country",
      Department: "department1",
      DepartmentSecond: "department2",
      Thesis_Title: "thesisTitle",
      Sponsor: "sponsor",
      NamePure: "name",
    })
    .select(
      "itcStudentId",
      "country",
      "department1",
      "department2",
      "sponsor",
      "status",
      "dateStart",
      "dateGraduation",
      "yearPromotion",
      "thesisTitle",
      "doi",
      "name",
    );

  return tb.objects() as PhdClean[];
}
