import * as d3 from "d3";
import type { ScaleLinear, ScalePower, PieArcDatum } from "d3";
import type { Position } from "geojson";
import type { FC } from "react";
import type { Appearance } from "../../types/Appearance";
import { nanoid } from "nanoid";

export type pieDatum = {
  value: number;
  label: string;
};

const ScaledPie: FC<{
  xy: Position;
  scale: ScaleLinear<number, number> | ScalePower<number, number>;
  pieSize: number;
  data: pieDatum[];
  colorScheme?: string[];
  style?: Appearance;
}> = ({
  xy,
  style,
  scale,
  pieSize,
  data,
  colorScheme = d3.schemeCategory10,
}) => {
  const angleGenerator = d3
    .pie<{ label: string; value: number }>()
    .value((d) => d.value)
    .padAngle(0.05);

  const arcGenerator = d3
    .arc<PieArcDatum<{ label: string }>>()
    .cornerRadius(2)
    .innerRadius(scale(pieSize) / 2) // TODO: set 0 if smaller than threshold value
    .outerRadius(scale(pieSize));

  const pieData = angleGenerator(data);

  const color = d3.scaleOrdinal(colorScheme);

  return (
    <g className="scaled-pie" transform={`translate(${xy[0]},${xy[1]})`}>
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
