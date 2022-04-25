import * as d3 from "d3";
import type { ScaleLinear, ScalePower, PieArcDatum } from "d3";
import type { Position } from "geojson";
import type { FC } from "react";
import type { SymbolAppearance } from "../../types/SymbolAppearance";
import { nanoid } from "nanoid";

type pieData = {
  value: number;
  label: string;
};

const ScaledPie: FC<{
  xy: Position;
  scale: ScaleLinear<number, number> | ScalePower<number, number>;
  pieSize: number;
  data: pieData[];
  colorScheme?: string[];
  style?: SymbolAppearance;
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
          fillOpacity={style?.fill?.opacity ?? 1}
          stroke={style?.stroke?.color ?? style?.fill?.color ?? "black"}
          strokeOpacity={style?.stroke?.opacity ?? 1}
          strokeWidth={style?.stroke?.width ?? 0}
          strokeLinejoin={style?.stroke?.linejoin ?? "round"}
        />
      ))}
    </g>
  );
};

export default ScaledPie;
