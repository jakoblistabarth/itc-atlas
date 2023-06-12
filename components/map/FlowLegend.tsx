import { FC } from "react";
import * as d3 from "d3";
import { ScaleLinear } from "d3";
import { fInt } from "../../lib/utilities/formaters";
import { Appearance } from "../../types/Appearance";
import LegendTitle from "./LegendTitle";
import defaultTheme from "../../lib/styles/themes/defaultTheme";

const FlowLegend: FC<{
  x?: number;
  y?: number;
  data: number[];
  scaleWidth: ScaleLinear<number, number>;
  title: string;
  unitLabel: string;
  style?: Appearance;
}> = ({
  data,
  scaleWidth,
  title,
  unitLabel,
  style = defaultTheme.flow,
  x = 0,
  y = 0,
}) => {
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
        {entries.map((entry, idx) => {
          const fontSize = 10;

          return (
            <g key={idx} transform={`translate(10, ${idx * 30})`}>
              <path
                d={linePath}
                stroke={style?.stroke ?? defaultTheme.flow?.stroke}
                fill={style?.fill ?? defaultTheme.flow?.fill}
                opacity={style?.opacity ?? defaultTheme.flow?.opacity}
                strokeWidth={scaleWidth(entry)}
                markerEnd={`url(#${
                  style?.markerEnd ?? defaultTheme.flow?.markerEnd
                })`}
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
