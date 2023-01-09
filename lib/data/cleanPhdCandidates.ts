import * as aq from "arquero";
import Fuse from "fuse.js";
import { PhdCandidate } from "../../types/PhdCandidate";
import { mapCountries } from "../mappings/country.name.EN";
import { departmentMap } from "../mappings/departments";
import { phdCandidateRaw } from "./getPhdCandidates";
import getUnsdCountries from "./getUnsdCountries";

export async function cleanPhdCandiates(data: phdCandidateRaw) {
  const unsdCodes = await getUnsdCountries();

  const fuseOptions = {
    includeScore: true,
    distance: 50,
    keys: ["Country or Area"],
  };
  const fuse = new Fuse(unsdCodes, fuseOptions);

  const tb = aq
    .from(data)
    .derive({
      studentId: aq.escape((d: phdCandidateRaw) =>
        d.ITCStudentNo ? d.ITCStudentNo + "" : null
      ),
      dateStart: aq.escape((d: phdCandidateRaw) =>
        d?.PhDStart ? d.PhDStart.toISOString() : null
      ),
      dateGraduation: aq.escape((d: phdCandidateRaw) =>
        d?.SISGraduated ? d.SISGraduated.toISOString() : null
      ),
      datePromotion: aq.escape((d: phdCandidateRaw) =>
        d?.Promotion ? new Date(d.Promotion + "GMT").toISOString() : null
      ),
      dateEnd: aq.escape((d: phdCandidateRaw) =>
        d?.PhDEnd ? d.PhDEnd.toISOString() : null
      ),
      country: aq.escape((d: phdCandidateRaw) => {
        const clean = d?.Country ? mapCountries(d.Country) : null;
        if (!clean) return null;
        const result = fuse.search(clean)[0];
        if (!result) return null;
        return result.item["ISO-alpha3 Code"];
      }),
      department1: aq.escape((d: phdCandidateRaw) => {
        const department = d.Department ?? null;
        if (!department) return null;
        const departmentMapped = departmentMap.get(department);
        return departmentMapped ?? department;
      }),
      department2: aq.escape((d: phdCandidateRaw) => {
        const department = d.DepartmentSecond ?? null;
        if (!department) return null;
        const departmentMapped = departmentMap.get(department);
        return departmentMapped ?? department;
      }),
      graduated: aq.escape((d: phdCandidateRaw) => {
        if (d.Graduated === null) return null;
        return d.Graduated === 0 ? false : true;
      }),
    })
    .rename({
      Country: "country",
      Department: "department1",
      DepartmentSecond: "department2",
      Thesis_Title: "thesisTitle",
      Sponsor: "sponsor",
    })
    .select(
      "studentId",
      "country",
      "department1",
      "department2",
      "sponsor",
      "graduated",
      "dateStart",
      "dateGraduation",
      "datePromotion",
      "thesisTitle"
    );

  return tb.objects() as PhdCandidate[];
}
