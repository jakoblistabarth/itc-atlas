import { FC, SVGProps } from "react";
import { GeoProjection, geoPath } from "d3-geo";
import { range } from "d3";
import { Feature, Polygon } from "geojson";

type Props = {
  bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number };
  projection: GeoProjection;
} & SVGProps<SVGPathElement>;

const RectangleMarker: FC<Props> = ({ bounds, projection, ...rest }) => {
  const { minLng, maxLng, minLat, maxLat } = bounds;

  const top = [
    [minLng, maxLat],
    ...range(Math.ceil(minLng), Math.floor(maxLng)).map((d) => [d, maxLat]),
  ];
  const right = [
    [maxLng, maxLat],
    ...range(Math.ceil(minLat), Math.floor(maxLat)).map((d) => [maxLng, d]),
  ];
  const bottom = [
    [maxLng, minLat],
    ...range(Math.ceil(maxLng), Math.floor(minLng), -1).map((d) => [d, minLat]),
  ];
  const left = [
    [minLng, minLat],
    ...range(Math.ceil(minLat), Math.floor(maxLat)).map((d) => [minLng, d]),
  ];
  const detailedCoordinates = [[...top, ...right, ...bottom, ...left]];

  const feature: Feature<Polygon> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: detailedCoordinates,
    },
  };
  const path = geoPath(projection);
  return (
    <g>
      <path
        d={path(feature) ?? ""}
        fill="none"
        strokeWidth="1"
        stroke="black"
        {...rest}
      />
    </g>
  );
};

export default RectangleMarker;
