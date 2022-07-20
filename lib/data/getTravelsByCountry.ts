import { Travel } from "../../types/Travels";
import getTravels from "./getTravels";

const getTravelsByCountry = async (countryName: string): Promise<Travel[]> => {
  const applicants = await getTravels();
  return applicants.filter((travel) => travel.country === countryName);
};

export default getTravelsByCountry;
