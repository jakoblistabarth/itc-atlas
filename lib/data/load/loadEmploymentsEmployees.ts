import loadEmployees from "./loadEmployees";
import loadEmployments from "./loadEmployments";
import loadStaffEnriched from "./loadStaffEnriched";

const loadApplicationsApplicants = async () => {
  const staff = await loadStaffEnriched();
  const employments = await loadEmployments(staff);
  const employees = await loadEmployees(staff);
  return { employments, employees };
};

export default loadApplicationsApplicants;
