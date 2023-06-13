import { FC, SVGProps } from "react";
import { GeoProjection } from "d3-geo";

type Props = {
  bounds: { minLng: number; maxLat: number; maxLng: number; minLat: number };
  projection: GeoProjection;
} & SVGProps<SVGPathElement>;

const RectangleMarker: FC<Props> = ({ bounds, projection, ...rest }) => {
  const leftTop = projection([bounds.minLng, bounds.maxLat]);
  const rightBottom = projection([bounds.maxLng, bounds.minLat]);
  const [x, y] = leftTop ?? [0, 0];
  const [x1, y1] = rightBottom ?? [0, 0];
  return (
    <g>
      <path
        d={`M${x} ${y} L${x1} ${y} L${x1} ${y1} L${x} ${y1} Z`}
        fill="none"
        strokeWidth="1"
        stroke="black"
        {...rest}
      />
    </g>
  );
};

export default RectangleMarker;
