import { FC } from "react";
import * as d3 from "d3";
import { ScalePower } from "d3";
import { fInt } from "../../lib/utilities/formaters";
import { Appearance } from "../../types/Appearance";
import LegendTitle from "./LegendTitle";
import { nanoid } from "nanoid";

const ProportionalSymbolLegend: FC<{
  x?: number;
  y?: number;
  data: number[];
  scaleRadius: ScalePower<number, number>;
  title: string;
  unitLabel: string;
  style?: Appearance;
}> = ({ x = 0, y = 0, data, scaleRadius, title, unitLabel, style }) => {
  const min = d3.min(data);
  const max = d3.max(data);
  const median = d3.median(data);
  const mean = d3.mean(data);
  if (!min || !max || !median || !mean) return <g />;
  const entries = [min, median, Math.ceil(mean), max];

  const labelOffset = style?.text?.fontSize ?? 10;

  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  return (
    <g id="legend" transform={`translate(${x}, ${y})`}>
      <LegendTitle>{title}</LegendTitle>
      <g id="legendEntries" transform="translate(1, 70)">
        {entries.map((entry) => {
          const maxRadius = scaleRadius(max);
          const entryRadius = scaleRadius(entry);
          const suffix = entry > 1 ? "s" : "";
          const label = fInt(entry) + " " + unitLabel + suffix;
          const linePath = line([
            [maxRadius, maxRadius - 2 * entryRadius],
            [maxRadius * 2, maxRadius - 2 * entryRadius],
          ]);
          if (!linePath) return <></>;
          return (
            <g key={nanoid()}>
              <circle
                cx={maxRadius}
                cy={maxRadius - entryRadius}
                r={entryRadius}
                fill={style?.fill ?? "none"}
                fillOpacity={style?.fillOpacity}
                stroke={style?.stroke ?? "black"}
                strokeWidth={style?.strokeWidth ?? "1"}
              />
              <path
                stroke={style?.stroke ?? "black"}
                strokeWidth={0.5}
                d={linePath}
              />
              <text
                fontSize={10}
                x={maxRadius * 2 + labelOffset}
                y={maxRadius - entryRadius * 2} //TODO: prevent overlaps
              >
                {typeof entry === "number" ? label : null}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
};

export default ProportionalSymbolLegend;
