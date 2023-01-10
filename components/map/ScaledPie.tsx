import * as d3 from "d3";
import type { PieArcDatum, ScaleOrdinal } from "d3";
import type { FC } from "react";
import type { Appearance } from "../../types/Appearance";
import { nanoid } from "nanoid";
import { Vector2 } from "three";

export type pieDatum = {
  value: number;
  label: string;
};

const ScaledPie: FC<{
  position: Vector2;
  radius: number;
  data: pieDatum[];
  color?: ScaleOrdinal<string, string>;
  style?: Appearance;
}> = ({
  position,
  style,
  radius,
  data,
  color = d3.scaleOrdinal().range(d3.schemeCategory10),
}) => {
  const angleGenerator = d3
    .pie<{ label: string; value: number }>()
    .value((d) => d.value)
    .padAngle(0.05);

  const arcGenerator = d3
    .arc<PieArcDatum<{ label: string }>>()
    .cornerRadius(2)
    .innerRadius(radius / 2) // TODO: set 0 if smaller than threshold value
    .outerRadius(radius);

  const pieData = angleGenerator(data);

  return (
    <g
      className="scaled-pie"
      transform={`translate(${position.x},${position.y})`}
    >
      {pieData.map((sector) => (
        <path
          key={nanoid()}
          d={arcGenerator(sector) ?? undefined}
          fill={color(sector.data.label)}
          fillOpacity={style?.fillOpacity ?? 1}
          paintOrder={"stroke"}
          stroke={style?.stroke ?? style?.fill ?? "black"}
          strokeOpacity={style?.strokeOpacity ?? 1}
          strokeWidth={style?.strokeWidth ?? 0}
          strokeLinejoin={style?.strokeLineJoin ?? "round"}
        />
      ))}
    </g>
  );
};

export default ScaledPie;
