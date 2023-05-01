import getBlockdiagramAreas from "../data/getBlockdiagramAreas";
import loadHgt from "./loadHgt";

const loadHgtData = async () => {
  const areas = await getBlockdiagramAreas();
  return areas.slice(0, 1).forEach((d) => loadHgt(d.locations, d.name));
  // loadHgt([[0, 0]], "test");
};

loadHgtData();
