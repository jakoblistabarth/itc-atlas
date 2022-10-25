import {
  geoBertin1953,
  geoInterruptedMollweide,
  geoRobinson,
  geoBaker,
  geoEckert5,
  geoPolyhedralWaterman,
} from "d3-geo-projection";
import {
  geoEqualEarth,
  geoNaturalEarth1,
  geoMercator,
  geoConicEqualArea,
  geoEquirectangular,
} from "d3-geo";

const projections = {
  // TODO: Add typing
  Bertin: geoBertin1953(),
  "Interrupted Mollweide": geoInterruptedMollweide(),
  Robinson: geoRobinson(),
  "Equal Earth": geoEqualEarth(),
  "Natural Earth": geoNaturalEarth1(),
  Mercator: geoMercator(),
  Baker: geoBaker(),
  "Conic Equal Area": geoConicEqualArea(),
  Equirectangular: geoEquirectangular(),
  "Eckert IV": geoEckert5(),
  "Steve Waterman’s butterfly projection": geoPolyhedralWaterman(),
};

export const getProjectionNames = () => Array.from(Object.keys(projections));

export default projections;
