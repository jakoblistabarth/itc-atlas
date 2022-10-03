import { FC } from "react";
import * as d3 from "d3";
import { scaleLinear, ScalePower } from "d3";
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
  if (
    min == undefined ||
    max == undefined ||
    median == undefined ||
    mean == undefined
  )
    return <g />;
  const entries = [min, median, Math.ceil(mean), max];

  const labelOffset = style?.text?.fontSize ?? 10;

  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  const diameter = scaleRadius(max) * 2;
  const xScale = scaleLinear()
    .domain([0, max - min])
    .range([0, diameter]);

  return (
    <g id="legend" transform={`translate(${x}, ${y})`}>
      <LegendTitle>{title}</LegendTitle>
      <g transform={`translate(1, ${20 + 20 + diameter / 2})`}>
        <g id="legendEntries">
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
        <g transform={`translate(0,${diameter / 2 + 20})`}>
          <rect
            x={0}
            y={0}
            width={xScale(max - min)}
            height={scaleRadius(max)}
            stroke="grey"
            fill="none"
            strokeWidth={0.5}
          />
          <g>
            {d3.range(min, max).map((val, idx) => {
              const y = scaleRadius(val);
              const x = xScale(idx);
              return (
                <circle key={nanoid()} cx={x} cy={scaleRadius(max) - y} r={1} />
              );
            })}
          </g>
          <line
            x1="0"
            x2={xScale(max - min)}
            y1={scaleRadius(max)}
            y2={scaleRadius(max)}
            strokeWidth={1}
            stroke={"black"}
          />
        </g>
      </g>
    </g>
  );
};

export default ProportionalSymbolLegend;
