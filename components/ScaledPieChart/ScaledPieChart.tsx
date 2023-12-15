import * as d3 from "d3";
import type { PieArcDatum, ScaleOrdinal } from "d3";
import type { FC, SVGProps } from "react";
import { Vector2 } from "three";

export type PieDatum = {
  value: number;
  label: string;
};

type Props = {
  position?: Vector2;
  radius: number;
  innerRadius?: number;
  data: PieDatum[];
  colorScale?: ScaleOrdinal<string, string>;
} & SVGProps<SVGPathElement>;

const ScaledPieChart: FC<Props> = ({
  radius,
  innerRadius = radius / 2,
  data,
  position = new Vector2(0, 0),
  colorScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.label))
    .range(d3.schemeCategory10) as ScaleOrdinal<string, string>,
  ...rest
}) => {
  const angleGenerator = d3
    .pie<{ label: string; value: number }>()
    .value((d) => d.value)
    .padAngle(0.05);

  const arcGenerator = d3
    .arc<PieArcDatum<{ label: string }>>()
    .cornerRadius(2)
    .innerRadius(innerRadius > 2 ? innerRadius : 0)
    .outerRadius(radius);

  const pieData = angleGenerator(data);

  return (
    <g
      className="scaled-pie"
      transform={`translate(${position.x},${position.y})`}
    >
      {pieData.map((sector, idx) => (
        <path
          key={`${sector.data.label}-${idx}`}
          d={arcGenerator(sector) ?? undefined}
          fill={colorScale(sector.data.label)}
          paintOrder="stroke"
          strokeWidth={2}
          stroke="transparent"
          strokeLinejoin="round"
          {...rest}
        />
      ))}
    </g>
  );
};

export default ScaledPieChart;
