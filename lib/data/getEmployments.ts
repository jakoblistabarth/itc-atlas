import cleanEmployments from "./cleanEmployments";
import getStaff from "./getStaff";

export default async function getEmployments() {
  const staff = await getStaff();
  return await cleanEmployments(staff);
}
