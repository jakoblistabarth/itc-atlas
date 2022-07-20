import { Applicant } from "../../types/Applicant";
import getApplicants from "./getApplicants";

const getApplicantsByCountry = async (
  countryName: string
): Promise<Applicant[]> => {
  const applicants = await getApplicants();
  return applicants.filter(
    (applicant) => applicant.countryOrigin === countryName
  );
};

export default getApplicantsByCountry;
