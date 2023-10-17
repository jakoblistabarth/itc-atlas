import { ScaleLinear, format } from "d3";
import type { FC, SVGProps } from "react";

type Props = {
  xScale: ScaleLinear<number, number>;
  top?: number;
  left?: number;
  tickLength?: number;
  tickFormat?: (n: number) => string;
} & SVGProps<SVGGElement>;

const AxisX: FC<Props> = ({
  xScale,
  top = 0,
  left = 0,
  tickLength = 5,
  tickFormat = format("~s"),
  ...rest
}) => {
  return (
    <g transform={`translate(${left} ${top})`} {...rest}>
      {xScale.ticks().map((d) => (
        <g key={d} transform={`translate(${xScale(d)} 0)`}>
          <line y2={tickLength} stroke={"black"} />
          <text
            textAnchor={"middle"}
            dominantBaseline={"middle"}
            y={tickLength + 7}
            fontSize={10}
          >
            {tickFormat(d)}
          </text>
        </g>
      ))}
    </g>
  );
};

export default AxisX;
