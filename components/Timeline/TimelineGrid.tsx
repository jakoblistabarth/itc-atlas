import { type FC } from "react";
import { fDateYear } from "../../lib/utilities/formaters";
import LabelPoint from "../LabelPoint";
import { Vector2 } from "three";
import { LabelPlacement } from "../../types/LabelPlacement";
import { useTimelineContext } from "./TimelineContext";

type Props = {
  height: number;
  margin?: number;
};

const TimelineGrid: FC<Props> = ({ height, margin = 0 }) => {
  const { xScale } = useTimelineContext();
  return (
    <g>
      {xScale.ticks().map((tick) => (
        <g key={tick.getTime()}>
          <line
            x1={xScale(tick)}
            x2={xScale(tick)}
            y1={margin / 2}
            y2={height - margin / 2}
            strokeWidth={0.5}
            stroke={"lightgrey"}
          />
          <LabelPoint
            position={new Vector2(xScale(tick), 0)}
            placement={LabelPlacement.BOTTOM}
          >
            {fDateYear(tick)}
          </LabelPoint>
          {/* <text fontSize={10} textAnchor="middle" y={10} x={xScale(tick)}>
            {fDateYear(tick)}
          </text> */}
          <LabelPoint
            position={new Vector2(xScale(tick), height)}
            placement={LabelPlacement.TOP}
            fontFamily={"Inter Variable"}
            fontSize={6}
          >
            {fDateYear(tick)}
          </LabelPoint>
          {/* <text fontSize={10} textAnchor="middle" y={height} x={xScale(tick)}>
            {fDateYear(tick)}
          </text> */}
        </g>
      ))}
      ;
    </g>
  );
};

export default TimelineGrid;
