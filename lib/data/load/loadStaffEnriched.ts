import loadStaff from "./loadStaff";
import getEmployeeIdIndex from "../id-indices/getEmployeeIdIndex";

const loadStaffEnriched = async () => {
  const staff = await loadStaff();
  const mIdIndex = getEmployeeIdIndex(staff);

  return staff.map((d) => ({
    ...d,
    mId_actual: d["Medewerker"],
    mId: mIdIndex.get(d["Medewerker"] ?? ""),
  }));
};
export default loadStaffEnriched;

export type StaffEnriched = Awaited<
  ReturnType<typeof loadStaffEnriched>
>[number];
