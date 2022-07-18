import type { FC } from "react";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import { TimelineEvent } from "../../../types/TimelineEvent";
import type { MapTheme } from "../../../types/MapTheme";

type Props = {
  position: [number, number];
  width: number;
  height: number;
  event: TimelineEvent;
  theme?: MapTheme;
};

const Event: FC<Props> = ({
  position,
  width,
  height,
  event,
  theme = defaultTheme,
}) => {
  return (
    <g transform={`translate(${position[0]}, ${position[1]})`}>
      <text fontSize={10} textAnchor="end" dominantBaseline="middle">
        {event.name}
      </text>
      <rect width={width} height={height} rx={2} />
    </g>
  );
};

export default Event;
