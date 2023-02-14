import { Travel } from "../../types/Travels";
import getTravels from "./getTravels";

const getTravelsByCountry = async (countryName: string): Promise<Travel[]> => {
  const travels = await getTravels();
  return travels.filter((travel) => travel.country === countryName);
};

export default getTravelsByCountry;
