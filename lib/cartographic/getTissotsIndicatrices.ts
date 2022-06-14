import { range } from "d3";
import { geoCircle } from "d3-geo";
import type { FeatureCollection, Feature, Polygon } from "geojson";

const getTissotsIndicatrices = (
  radius: number,
  step = 20
): FeatureCollection<Polygon> => {
  const circle = geoCircle()
    .center((d) => d)
    .radius(radius)
    .precision(10);

  const features = range(-180, 180, step).flatMap((lon) =>
    range(-80, 80 + 1, step).map(
      (lat) =>
        <Feature<Polygon>>{
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: circle([lon, lat]).coordinates,
          },
          properties: {
            lon,
            lat,
          },
        }
    )
  );

  return {
    type: "FeatureCollection",
    features: features,
  };
};

export default getTissotsIndicatrices;
