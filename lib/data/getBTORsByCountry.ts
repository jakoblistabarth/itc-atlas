import { BTOR } from "../../types/Travels";
import getBTORs from "./getBTORs";

const getBTORsByCountry = async (countryName: string): Promise<BTOR[]> => {
  const btors = await getBTORs();
  return btors.filter((btor) => btor.destination === countryName);
};

export default getBTORsByCountry;
