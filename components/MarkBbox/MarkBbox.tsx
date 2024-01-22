import { range } from "d3";
import { geoPath } from "d3-geo";
import { BBox, Feature, Polygon } from "geojson";
import { FC, SVGProps } from "react";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";

type Props = {
  bounds: BBox;
} & SVGProps<SVGPathElement>;

const MarkBbox: FC<Props> = ({ bounds, ...rest }) => {
  const [sWLng, sWLat, nELng, nELat] = bounds;
  const { projection } = useMapLayoutContext();

  const top = [
    [sWLng, nELat],
    ...range(Math.floor(sWLng), Math.ceil(nELng), 0.25).map((d) => [d, nELat]),
  ];
  const right = [
    [nELng, nELat],
    ...range(Math.floor(nELat), Math.ceil(sWLat), -0.25).map((d) => [nELng, d]),
  ];
  const bottom = [
    [nELng, sWLat],
    ...range(Math.floor(nELng), Math.ceil(sWLng), -0.25).map((d) => [d, sWLat]),
  ];
  const left = [
    [sWLng, sWLat],
    ...range(Math.ceil(sWLat), Math.floor(nELat), 0.25).map((d) => [sWLng, d]),
  ];
  const detailedCoordinates = [[...top, ...right, ...bottom, ...left, top[0]]];

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
