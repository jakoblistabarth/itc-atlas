import { PhdCandidate } from "../../types/PhdCandidate";
import getPhdCandidates from "./getPhdCandidates";

const getPhdCandidatesByCountry = async (
  isoCode: string
): Promise<PhdCandidate[]> => {
  const phds = await getPhdCandidates();
  return phds.filter((phd) => phd.country === isoCode);
};

export default getPhdCandidatesByCountry;
