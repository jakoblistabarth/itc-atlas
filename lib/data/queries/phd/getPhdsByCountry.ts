import { Phd } from "../../../../types/Phd";
import getPhds from "../../load/loadPhds";

const getPhdsByCountry = async (isoCode: string): Promise<Phd[]> => {
  const phds = await getPhds();
  return phds.filter((phd) => phd.country === isoCode);
};

export default getPhdsByCountry;
