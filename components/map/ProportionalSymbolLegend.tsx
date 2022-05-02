import { FC, useRef, useEffect } from "react";
import * as d3 from "d3";
import { ScaleLinear } from "d3";
import { fInt } from "../../lib/utilities/formaters";
import { SymbolAppearance } from "../../types/SymbolAppearance";

const ProportionalSymbolLegend: FC<{
  x?: number;
  y?: number;
  data: number[];
  scaleRadius: ScaleLinear<number, number>;
  title: string;
  unitLabel: string;
  style: SymbolAppearance;
}> = ({ x = 0, y = 0, data, scaleRadius, title, unitLabel, style }) => {
  const min = d3.min(data);
  const max = d3.max(data);
  const median = d3.median(data);
  const mean = d3.mean(data);
  if (!min || !max || !median || !mean) return <g />;
  const entries = [min, median, Math.ceil(mean), max];

  const labelOffset = style.text?.size ?? 10;

  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  return (
    <g id="legend" transform={`translate(${x}, ${y})`}>
      <text y={16} fontFamily="Fraunces" fontWeight="bold">
        {title}
      </text>
      <g id="legendEntries" transform="translate(1, 70)">
        {console.log(entries)}
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
            <g>
              <circle
                cx={maxRadius}
                cy={maxRadius - entryRadius}
                r={entryRadius}
                fill={style.fill?.color ?? "none"}
                fillOpacity={style.fill?.opacity}
                stroke={style.stroke?.color ?? "black"}
                strokeWidth="1"
              />
              <path
                stroke={style.stroke?.color ?? "black"}
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
