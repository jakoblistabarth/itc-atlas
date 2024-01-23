import getBlockdiagramAreas from "../data/getBlockdiagramAreas";
import loadHgt from "./loadHgt";

const loadHgtData = async () => {
  const areas = await getBlockdiagramAreas();
  return areas
    .filter((d) => d.download === true)
    .forEach((d) => loadHgt(d.bbox, d.name));
};

export default loadHgtData;
