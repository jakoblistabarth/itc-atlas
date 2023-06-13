import { FC, SVGProps } from "react";
import { Vector4 } from "three";
type Props = {
  bounds: Vector4;
} & SVGProps<SVGPathElement>;

const RectangleMarker: FC<Props> = ({ bounds, ...rest }) => {
  const leftTop = [bounds.x, bounds.y];
  const rightBottom = [bounds.z, bounds.w];
  const [x, y] = leftTop ?? [0, 0];
  const [x1, y1] = rightBottom ?? [0, 0];
  return (
    <g>
      <path
        d={`M${x} ${y} L${x1} ${y} L${x1} ${y1} L${x} ${y1} Z`}
        fill="lightgrey"
        strokeWidth="1"
        stroke="black"
        {...rest}
      />
    </g>
  );
};

export default RectangleMarker;