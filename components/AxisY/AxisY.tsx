import { ScaleLinear, format } from "d3";
import type { FC, SVGProps } from "react";

type Props = {
  yScale: ScaleLinear<number, number>;
  top?: number;
  left?: number;
  tickLength?: number;
  tickFormat?: (n: number) => string;
} & SVGProps<SVGGElement>;

const AxisY: FC<Props> = ({
  yScale,
  top = 0,
  left = 0,
  tickLength = 5,
  tickFormat = format("~r"),
  ...rest
}) => {
  return (
    <g transform={`translate(${left} ${top})`} {...rest}>
      {yScale.ticks().map((d) => (
        <g key={d} transform={`translate(0 ${yScale(d)})`}>
          <line x1={-tickLength} stroke={"black"} />
          <text
            x={-tickLength - 2}
            textAnchor={"end"}
            dominantBaseline={"middle"}
            fontSize={10}
          >
            {tickFormat(d)}
          </text>
        </g>
      ))}
    </g>
  );
};

export default AxisY;
