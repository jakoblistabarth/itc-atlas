import { NePopulatedPlaces, NeScales } from "../../types/NeTopoJson";
import fs from "fs";

export default function getRivers(scale?: NeScales): NePopulatedPlaces {
  const scaleStr = scale === "10m" ? scale : "110m";
  const filePath = `./data/topographic/ne_${scaleStr}_populated_places.json`;
  const rawdata = fs.readFileSync(filePath);
  const data = JSON.parse(rawdata.toString());
  return data;
}
