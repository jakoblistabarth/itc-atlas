import getBlockdiagramAreas from "../data/getBlockdiagramAreas";
import loadHgt from "./loadHgt";

const loadHgtData = async () => {
  const areas = await getBlockdiagramAreas();
  return areas.forEach((d) => loadHgt(d.locations, d.name));
};

export default loadHgtData;
