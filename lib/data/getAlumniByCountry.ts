import { Alumni } from "../../types/Alumni";
import getAlumni from "./getAlumni";

const getAlumniByCountry = async (countryName: string): Promise<Alumni[]> => {
  const Alumnis = await getAlumni();
  return Alumnis.filter((Alumni) => Alumni.country === countryName);
};

export default getAlumniByCountry;
