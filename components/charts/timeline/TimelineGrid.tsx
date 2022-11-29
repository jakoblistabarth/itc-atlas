import type { FC } from "react";
import { fDateYear } from "../../../lib/utilities/formaters";
import type { ScaleTime } from "d3-scale";
import { nanoid } from "nanoid";
import PointLabel from "../../map/PointLabel";
import { Vector2 } from "three";
import { LabelPlacement } from "../../../types/LabelPlacement";

type Props = {
  scale: ScaleTime<number, number>;
  height: number;
  margin?: number;
};

const TimelineGrid: FC<Props> = ({ scale, height, margin = 0 }) => {
  return (
    <g>
      {scale.ticks().map((tick) => (
        <g key={nanoid()}>
          <line
            x1={scale(tick)}
            x2={scale(tick)}
            y1={margin / 2}
            y2={height - margin / 2}
            strokeWidth={0.5}
            stroke={"lightgrey"}
          />
          <PointLabel
            position={new Vector2(scale(tick), 0)}
            placement={LabelPlacement.BOTTOM}
          >
            {fDateYear(tick)}
          </PointLabel>
          {/* <text fontSize={10} textAnchor="middle" y={10} x={scale(tick)}>
            {fDateYear(tick)}
          </text> */}
          <PointLabel
            position={new Vector2(scale(tick), height)}
            placement={LabelPlacement.TOP}
            style={{ fontFamily: "Inter", fontSize: 6 }}
          >
            {fDateYear(tick)}
          </PointLabel>
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
