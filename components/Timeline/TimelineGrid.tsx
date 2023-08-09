import type { FC } from "react";
import { fDateYear } from "../../lib/utilities/formaters";
import type { ScaleTime } from "d3-scale";
import LabelPoint from "../LabelPoint";
import { Vector2 } from "three";
import { LabelPlacement } from "../../types/LabelPlacement";

type Props = {
  scale: ScaleTime<number, number>;
  height: number;
  margin?: number;
};

const TimelineGrid: FC<Props> = ({ scale, height, margin = 0 }) => {
  return (
    <g>
      {scale.ticks().map((tick) => (
        <g key={tick.getTime()}>
          <line
            x1={scale(tick)}
            x2={scale(tick)}
            y1={margin / 2}
            y2={height - margin / 2}
            strokeWidth={0.5}
            stroke={"lightgrey"}
          />
          <LabelPoint
            position={new Vector2(scale(tick), 0)}
            placement={LabelPlacement.BOTTOM}
          >
            {fDateYear(tick)}
          </LabelPoint>
          {/* <text fontSize={10} textAnchor="middle" y={10} x={scale(tick)}>
            {fDateYear(tick)}
          </text> */}
          <LabelPoint
            position={new Vector2(scale(tick), height)}
            placement={LabelPlacement.TOP}
            fontFamily={"Inter"}
            fontSize={6}
          >
            {fDateYear(tick)}
          </LabelPoint>
          {/* <text fontSize={10} textAnchor="middle" y={height} x={scale(tick)}>
            {fDateYear(tick)}
          </text> */}
        </g>
      ))}
      ;
    </g>
  );
};

export default TimelineGrid;
