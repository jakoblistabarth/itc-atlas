import { readFileSync } from "fs";
import { BlockDiagramArea } from "../../types/BlockdiagramArea";

const getBlockdiagramAreas = async () => {
  const filePath = "./data/static/blockdiagrammAreas.json";
  const rawdata = readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data.areas as BlockDiagramArea[];
};

export default getBlockdiagramAreas;
