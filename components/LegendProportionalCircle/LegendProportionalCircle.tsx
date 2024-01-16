import { FC, SVGProps } from "react";
import { min, max, median, mean, line, ScalePower } from "d3";
import { fInt } from "../../lib/utilities/formaters";
import { Appearance } from "../../types/Appearance";
import LegendTitle from "../LegendTitle";
import LegednProportionalScaleFunction from "../LegendProportionalScaleFunction";

type Props = {
  data: number[];
  scaleRadius: ScalePower<number, number>;
  title: string;
  titleFontSize?: number;
  entryFontSize?: number;
  unitLabel: string;
  style?: Appearance;
  showFunction?: boolean;
} & SVGProps<SVGGElement>;

const LegendProportionalCircle: FC<Props> = ({
  data,
  scaleRadius,
  title,
  titleFontSize = 9,
  entryFontSize = 6,
  unitLabel,
  style,
  showFunction = true,
  ...rest
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

  const maxRadius = scaleRadius(maxData);
  const maxDiameter = maxRadius * 2;

  return (
    <g id="legend" {...rest}>
      <LegendTitle fontSize={titleFontSize}>{title}</LegendTitle>
      <g transform={`translate(1, ${titleFontSize * 2 + maxDiameter / 2})`}>
        <g id="legendEntries">
          {entries.map((entry, idx) => {
            const entryRadius = scaleRadius(entry);
            const suffix = entry > 1 ? "s" : "";
            const label = fInt(entry) + " " + unitLabel + suffix;
            const linePath = lineGenerator([
              [maxRadius, maxRadius - 2 * entryRadius],
              [maxRadius * 2, maxRadius - 2 * entryRadius],
            ]);
            if (!linePath) return null;
            return (
              <g key={`${entry}-${idx}`}>
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
                  fontSize={entryFontSize}
                  x={maxRadius * 2 + labelOffset}
                  y={maxRadius - entryRadius * 2} //TODO: prevent overlaps
                >
                  {typeof entry === "number" ? label : null}
                </text>
              </g>
            );
          })}
        </g>
        <g transform={`translate(0,${maxDiameter / 2 + 20})`}>
          {showFunction && (
            <LegednProportionalScaleFunction
              data={data}
              scaleRadius={scaleRadius}
            />
          )}
        </g>
      </g>
    </g>
  );
};

export default LegendProportionalCircle;
