import { FC, SVGProps } from "react";
import { min, max, median, mean, ScaleLinear, scaleBand } from "d3";
import { fInt } from "../../lib/utilities/formaters";
import LegendTitle from "../LegendTitle";
import LeaderLine from "../LeaderLine";
import { Vector2 } from "three";

const LegendProportionalRectangle: FC<
  {
    data: number[];
    scaleHeight: ScaleLinear<number, number>;
    title: string;
    titleFontSize?: number;
    entryFontSize?: number;
    entrySymbolWidth?: number;
    entryUnit?: string;
  } & SVGProps<SVGGElement>
> = ({
  data,
  scaleHeight,
  title,
  titleFontSize = 9,
  entryFontSize = 6,
  entrySymbolWidth = 5,
  entryUnit,
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

  const maxHeight = scaleHeight(maxData);
  const labelYscale = scaleBand()
    .domain(entries.reverse().map((_, idx) => idx.toString()))
    .range([0, maxHeight]);

  return (
    <g id="legend" {...rest}>
      <LegendTitle fontSize={titleFontSize}>{title}</LegendTitle>
      <g transform={`translate(1, ${titleFontSize * 2})`}>
        <g id="legendEntries">
          {entries.map((entry, idx) => {
            const entrySymbolHeight = scaleHeight(entry);
            const suffix = entry > 1 ? "s" : "";
            const unit = entryUnit ? entryUnit + suffix : "";
            const label = fInt(entry) + " " + unit;
            const labelTargetPosition = new Vector2(
              entrySymbolWidth +
                entryFontSize * 2 +
                entrySymbolWidth * entries.length,
              labelYscale(idx.toString())
            );
            return (
              <g key={`${entry}-${idx}`}>
                <rect
                  x={entrySymbolWidth * idx}
                  y={maxHeight / 2 + entrySymbolHeight / -2}
                  width={entrySymbolWidth}
                  height={entrySymbolHeight}
                  fill={"none"}
                  fillOpacity={0.2}
                  stroke={"black"}
                  strokeWidth={"1"}
                />
                <LeaderLine
                  sourcePos={
                    new Vector2(
                      entrySymbolWidth * (1 + idx) + 2,
                      maxHeight / 2 - entrySymbolHeight / 2
                    )
                  }
                  targetPos={labelTargetPosition}
                  orientation="horizontal"
                  stroke={"black"}
                  strokeWidth={0.25}
                />
                <text
                  fontSize={entryFontSize}
                  x={labelTargetPosition.x + entryFontSize}
                  y={labelTargetPosition.y + entryFontSize / 2}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>
      </g>
    </g>
  );
};

export default LegendProportionalRectangle;
