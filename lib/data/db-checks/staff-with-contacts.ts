import getContacts from "../getContacts";
import getStaff, { StaffClean } from "../getStaff";
import * as aq from "arquero";

(async () => {
  const contactData = await getContacts();
  const staffData = await getStaff();

  const tb = aq.from(staffData).dedupe("mId");
  // const tb = aq.from(staffData).dedupe("nationality", "dateOfBirth", "gender");

  const res = tb.objects() as StaffClean[];

  const matches = res.reduce((acc: any[], s) => {
    if (s.dateOfBirth === null || s.gender === null || s.nationality === null)
      return acc;
    const match = contactData.filter((c) => {
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
      contactId: c.contactId,
    });
    return acc;
  }, []);
  // print staff members which match a contact by date of birth, country and gender
  console.table(matches);
})();
