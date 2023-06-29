import { PhdClean } from "../../../../types/PhdClean";
import getPhds from "../../load/loadPhds";

const getPhdsByCountry = async (isoCode: string): Promise<PhdClean[]> => {
  const phds = await getPhds();
  return phds.filter((phd) => phd.country === isoCode);
};

export default getPhdsByCountry;
