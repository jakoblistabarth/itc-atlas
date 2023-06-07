import { FC, SVGProps } from "react";
import { Vector2 } from "three";
import { Text } from "@visx/text";

type Props = {
  position: Vector2;
  width?: number;
  height?: number;
} & SVGProps<SVGCircleElement>;

const RectangleMarker: FC<Props> = ({ position, width, height, ...rest }) => {
  return (
    <g transform={`translate(${position.x} ${position.y})`}>
      <rect
        width={width}
        height={height}
        fill="lightgrey"
        strokeWidth="1"
        stroke="black"
      />
      ;
    </g>
  );
};

export default RectangleMarker;
