import { FC } from "react";
import * as d3 from "d3";
import { ScaleLinear } from "d3";
import { fInt } from "../../lib/utilities/formaters";
import LegendTitle from "./LegendTitle";
import { FlowStyleProps } from "./Flow";

const FlowLegend: FC<{
  x?: number;
  y?: number;
  data: number[];
  scaleWidth: ScaleLinear<number, number>;
  title: string;
  unitLabel: string;
  flowStyle?: FlowStyleProps;
}> = ({ data, scaleWidth, title, unitLabel, x = 0, y = 0, flowStyle = {} }) => {
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

  const { arrowShape, ...styleProps } = flowStyle;

  return (
    <g id="legend" transform={`translate(${x}, ${y})`}>
      <LegendTitle>{title}</LegendTitle>
      <g id="entries" transform="translate(0, 40)">
        {entries.map((entry, idx) => {
          const fontSize = 10;

          return (
            <g key={idx} transform={`translate(10, ${idx * 30})`}>
              <path
                stroke={"black"}
                {...styleProps}
                d={linePath}
                strokeWidth={scaleWidth(entry)}
                markerEnd={`url(#${arrowShape ?? "tip"})`}
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
