import {
  geoBertin1953,
  geoInterruptedMollweide,
  geoRobinson,
  geoBaker,
} from "d3-geo-projection";
import { geoEqualEarth, geoNaturalEarth1, geoMercator } from "d3-geo";

const projections = {
  Bertin: geoBertin1953(),
  "Interrupted Mollweide": geoInterruptedMollweide(),
  Robinson: geoRobinson(),
  "Equal Earth": geoEqualEarth(),
  "Natural Earth": geoNaturalEarth1(),
  Mercator: geoMercator(),
  Baker: geoBaker(),
};

export const getProjectionNames = () => Array.from(Object.keys(projections));

export default projections;
