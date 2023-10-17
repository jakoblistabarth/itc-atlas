import { ScaleLinear } from "d3";
import type { FC, SVGProps } from "react";

type Props = {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  top?: number;
  left?: number;
  tickLength?: number;
  tickFormat?: (n: number) => string;
} & SVGProps<SVGGElement>;

const AxisY: FC<Props> = ({ xScale, yScale, top = 0, left = 0, ...rest }) => {
  const [minX, maxX] = xScale.domain().map((d) => xScale(d));
  return (
    <g transform={`translate(${left} ${top})`} {...rest}>
      {yScale.ticks().map((d) => (
        <g key={d} transform={`translate(0 ${yScale(d)})`}>
          <line x1={minX} x2={maxX} stroke={"lightgrey"} />
        </g>
      ))}
    </g>
  );
};

export default AxisY;
