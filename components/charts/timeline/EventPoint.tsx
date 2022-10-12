import type { FC } from "react";
import { Vector2 } from "three";

type Props = React.PropsWithChildren<{
  position: Vector2;
  radius?: number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
}>;

// TODO: Use date and xscale as prop as for EventPeriod

const Event: FC<Props> = ({
  position,
  radius = 2,
  fill = "black",
  fillOpacity = 1,
  stroke = "none",
  strokeOpacity = 1,
  strokeWidth = 1,
  children,
}) => {
  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      <circle
        r={radius}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
      />
      {children}
    </g>
  );
};

export default Event;
