import loadApplicants from "../load/loadApplicants";
import * as aq from "arquero";
import { EmployeeClean } from "../../../types/EmployeeClean";
import loadEmployees from "../load/loadEmployees";
import loadContactsEnriched from "../load/loadContactsEnriched";

(async () => {
  const contacts = await loadContactsEnriched();
  const applicants = await loadApplicants(contacts);
  const staffData = await loadEmployees();

  const tb = aq.from(staffData).dedupe("mId");
  const res = tb.objects() as EmployeeClean[];

  const matches = res.reduce((acc: any[], s) => {
    if (s.dateOfBirth === null || s.gender === null || s.nationality === null)
      return acc;
    const match = applicants.filter((c) => {
      return (
        c.gender === s.gender &&
        c.dateOfBirth?.getTime() === s.dateOfBirth?.getTime() &&
        c.countryIsoAlpha3 === s.nationality
      );
    });
    if (match.length === 0) return acc;
    const c = match[0];
    acc.push({
      sGender: s.gender,
      cGender: c.gender,
      sNat: s.nationality,
      cNat: c.countryIsoAlpha3,
      sDoB: s.dateOfBirth,
      cDoB: c.dateOfBirth,
      matches: match.length,
      contactId: c.applicantId,
    });
    return acc;
  }, []);
  // print staff members which match a contact by date of birth, country and gender
  console.table(matches);
})();
