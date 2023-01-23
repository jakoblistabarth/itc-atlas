import cleanEmployees from "./cleanEmployees";
import getStaff from "./getStaff";

export default async function getEmployees() {
  const staff = await getStaff();
  return await cleanEmployees(staff);
}
