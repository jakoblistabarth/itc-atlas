import cleanEmployments from "./cleanEmployments";
import getStaff from "./getStaff";

export default async function getEmployees() {
  const staff = await getStaff();
  return await cleanEmployments(staff);
}
