import { Alumni } from "../../types/Alumni";
import getAlumni from "./getAlumni";

const getAlumniByCountry = async (countryCode: string): Promise<Alumni[]> => {
  const Alumnis = await getAlumni();
  return Alumnis.filter((Alumni) => Alumni.countryISO3 === countryCode);
};

export default getAlumniByCountry;
