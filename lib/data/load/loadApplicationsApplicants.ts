import loadApplicants from "./loadApplicants";
import loadApplications from "./loadApplications";
import loadContactsEnriched from "./loadContactsEnriched";

const loadApplicationsApplicants = async () => {
  const contacts = await loadContactsEnriched();
  const applications = await loadApplications(contacts);
  const applicants = await loadApplicants(contacts);
  return { applications, applicants };
};

export default loadApplicationsApplicants;
