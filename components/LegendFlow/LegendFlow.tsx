import { FC, SVGProps } from "react";
import * as d3 from "d3";
import { ScaleLinear } from "d3";
import { fInt } from "../../lib/utilities/formaters";
import LegendTitle from "../LegendTitle";
import { FlowStyleProps } from "../MarkFlow";

type Props = {
  data: number[];
  scaleWidth: ScaleLinear<number, number>;
  title: string;
  unitLabel: string;
  flowStyle?: FlowStyleProps;
} & SVGProps<SVGGElement>;

const LegendFlow: FC<Props> = ({
  data,
  scaleWidth,
  title,
  unitLabel,
  flowStyle = {},
  ...rest
}) => {
  const min = d3.min(data);
  const max = d3.max(data);
  if (!min || !max) return <g />;
  const entries = max > min ? [min, Math.ceil(max / 2), max] : [min];

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
    <g id="legend" {...rest}>
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
                markerEnd={`url(#${arrowShape ?? "tapered"})`}
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

export default LegendFlow;
