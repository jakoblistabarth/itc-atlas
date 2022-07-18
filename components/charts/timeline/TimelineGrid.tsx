import type { FC } from "react";
import { fDateYear } from "../../../lib/utilities/formaters";
import type { ScaleTime } from "d3-scale";
import { nanoid } from "nanoid";

type Props = {
  scale: ScaleTime<number, number>;
  height: number;
};

const TimelineGrid: FC<Props> = ({ scale, height }) => {
  return (
    <g>
      {scale.ticks().map((tick) => (
        <g key={nanoid()}>
          <line
            x1={scale(tick)}
            x2={scale(tick)}
            y1={0}
            y2={height}
            strokeWidth={0.5}
            stroke={"lightgrey"}
          />
          <text fontSize={10} textAnchor="middle" y={0} x={scale(tick)}>
            {fDateYear(tick)}
          </text>
          <text fontSize={10} textAnchor="middle" y={height} x={scale(tick)}>
            {fDateYear(tick)}
          </text>
        </g>
      ))}
      ;
    </g>
  );
};

export default TimelineGrid;
