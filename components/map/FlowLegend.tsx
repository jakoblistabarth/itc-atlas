import { FC } from "react";
import * as d3 from "d3";
import { ScaleLinear } from "d3";
import { fInt } from "../../lib/utilities/formaters";
import { Appearance } from "../../types/Appearance";
import LegendTitle from "./LegendTitle";
import { nanoid } from "nanoid";

const FlowLegend: FC<{
  x?: number;
  y?: number;
  data: number[];
  scaleWidth: ScaleLinear<number, number>;
  title: string;
  unitLabel: string;
  style: Appearance;
}> = ({ data, scaleWidth, title, unitLabel, style, x = 0, y = 0 }) => {
  const min = d3.min(data);
  const max = d3.max(data);
  if (!min || !max) return <g />;
  const entries = [min, max / 2, max];

  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  const linePath = line([
    [0, 0],
    [80, 0],
  ]);
  if (!linePath) return <></>;

  return (
    <g id="legend" transform={`translate(${x}, ${y})`}>
      <LegendTitle>{title}</LegendTitle>
      <g id="entries" transform="translate(0, 40)">
        {entries.map((entry, index) => {
          const fontSize = style.text?.fontSize ?? 10;

          return (
            <g key={nanoid()} transform={`translate(10, ${index * 30})`}>
              <path
                d={linePath}
                stroke={style.stroke ?? "black"}
                fill={style.fill ?? "none"}
                opacity={style.opacity ?? "1"}
                strokeWidth={scaleWidth(entry)}
                marker-end={`url(#${style.markerEnd})`}
              />
              <text x={100} y={fontSize / 2} fontSize={fontSize}>
                {fInt(entry) + " " + unitLabel ?? null}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
};

export default FlowLegend;
