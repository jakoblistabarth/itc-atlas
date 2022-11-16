import { FC } from "react";
import { min, max, median, mean, line, ScalePower } from "d3";
import { fInt } from "../../lib/utilities/formaters";
import { Appearance } from "../../types/Appearance";
import LegendTitle from "./LegendTitle";
import { nanoid } from "nanoid";
import ProportionalSymbolScaleFunction from "./ProportionalSymbolScaleFunction";

const ProportionalSymbolLegend: FC<{
  x?: number;
  y?: number;
  data: number[];
  scaleRadius: ScalePower<number, number>;
  title: string;
  unitLabel: string;
  style?: Appearance;
  showFunction?: boolean;
}> = ({
  x = 0,
  y = 0,
  data,
  scaleRadius,
  title,
  unitLabel,
  style,
  showFunction = true,
}) => {
  const minData = min(data);
  const maxData = max(data);
  const medianData = median(data);
  const meanData = mean(data);
  if (
    minData == undefined ||
    maxData == undefined ||
    medianData == undefined ||
    meanData == undefined
  )
    return <g />;
  const entries = [minData, medianData, Math.ceil(meanData), maxData];

  const labelOffset = style?.text?.fontSize ?? 10;

  const lineGenerator = line()
    .x((d) => d[0])
    .y((d) => d[1]);

  const diameter = scaleRadius(maxData) * 2;

  return (
    <g id="legend" transform={`translate(${x}, ${y})`}>
      <LegendTitle>{title}</LegendTitle>
      <g transform={`translate(1, ${20 + 20 + diameter / 2})`}>
        <g id="legendEntries">
          {entries.map((entry) => {
            const maxRadius = scaleRadius(maxData);
            const entryRadius = scaleRadius(entry);
            const suffix = entry > 1 ? "s" : "";
            const label = fInt(entry) + " " + unitLabel + suffix;
            const linePath = lineGenerator([
              [maxRadius, maxRadius - 2 * entryRadius],
              [maxRadius * 2, maxRadius - 2 * entryRadius],
            ]);
            if (!linePath) return null;
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
          {showFunction && (
            <ProportionalSymbolScaleFunction
              data={data}
              scaleRadius={scaleRadius}
            />
          )}
        </g>
      </g>
    </g>
  );
};

export default ProportionalSymbolLegend;
