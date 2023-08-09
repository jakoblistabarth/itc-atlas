import { FC, SVGProps } from "react";
import { GeoProjection, geoPath } from "d3-geo";
import { range } from "d3";
import { Feature, Polygon, BBox } from "geojson";

type Props = {
  bounds: BBox;
  projection: GeoProjection;
} & SVGProps<SVGPathElement>;

const MarkBbox: FC<Props> = ({ bounds, projection, ...rest }) => {
  const [minLng, maxLat, maxLng, minLat] = bounds;

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
    ...range(Math.floor(maxLng), Math.ceil(minLng), -1).map((d) => [d, minLat]),
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

export default MarkBbox;
