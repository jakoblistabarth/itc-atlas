import * as aq from "arquero";
import Fuse from "fuse.js";
import { PhdCandidate } from "../../../types/PhdCandidate";
import { mapCountries } from "../../mappings/country.name.EN";
import { mapToDepartment } from "../../mappings/departments";
import { PhdCandidateRaw } from "../load/loadPhdCandidates";
import loadCountries from "../load/loadUnsdCountries";

export async function cleanPhdCandidates(data: PhdCandidateRaw[]) {
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
      itcStudentId: aq.escape((d: PhdCandidateRaw) =>
        d.ITCStudentNo ? d.ITCStudentNo + "" : null
      ),
      dateStart: aq.escape((d: PhdCandidateRaw) =>
        d?.PhDStart ? d.PhDStart.toISOString() : null
      ),
      dateGraduation: aq.escape((d: PhdCandidateRaw) =>
        d?.SISGraduated ? d.SISGraduated.toISOString() : null
      ),
      yearPromotion: aq.escape((d: PhdCandidateRaw) =>
        d?.Promotion && d?.Promotion > 1950 ? d.Promotion : null
      ),
      dateEnd: aq.escape((d: PhdCandidateRaw) =>
        d?.PhDEnd ? d.PhDEnd.toISOString() : null
      ),
      country: aq.escape((d: PhdCandidateRaw) => {
        const clean = d?.Country ? mapCountries(d.Country) : null;
        if (!clean) return null;
        const result = fuse.search(clean)[0];
        if (!result) return null;
        return result.item["ISO-alpha3 Code"];
      }),
      department1: aq.escape((d: PhdCandidateRaw) => {
        return mapToDepartment(d.Department);
      }),
      department2: aq.escape((d: PhdCandidateRaw) => {
        return mapToDepartment(d.DepartmentSecond);
      }),
      status: (d: PhdCandidateRaw) =>
        aq.op.padstart(d.LastStatus ? d.LastStatus + "" : "00", 2, "0"),
    })
    .rename({
      Country: "country",
      Department: "department1",
      DepartmentSecond: "department2",
      Thesis_Title: "thesisTitle",
      Sponsor: "sponsor",
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
      "thesisTitle"
    );

  return tb.objects() as PhdCandidate[];
}
