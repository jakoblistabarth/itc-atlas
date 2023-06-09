import { FC, SVGProps } from "react";
import { GeoProjection } from "d3-geo";

type Props = {
  projection: GeoProjection;
  position: [number, number];
  width: number;
  height: number;
} & SVGProps<SVGRectElement>;

const RectangleMarker: FC<Props> = ({
  projection,
  position,
  width,
  height,
  ...rest
}) => {
  const projectedPosition = projection(position);
  const [x, y] = projectedPosition ? projectedPosition : [0, 0];
  return (
    <rect
      transform={`translate(${x} ${y})`}
      width={width}
      height={height}
      fill="lightgrey"
      strokeWidth="1"
      stroke="black"
      {...rest}
    />
  );
};

export default RectangleMarker;
