import { FC, useRef, useEffect } from "react";
import * as d3 from "d3";
import { Position } from "geojson";
import { SymbolAppearance } from "../../types/SymbolAppearance";
import { color, ScaleLinear, ScaleOrdinal, ScalePower } from "d3";

const ScaledPie: FC<{
  xy: Position;
  scale: ScaleLinear<number, number> | ScalePower<number, number>;
  pieSize: number;
  pieProperty: any[];
  pieValue: string;
  colorScheme?: string[];
  style?: SymbolAppearance;
}> = ({
  xy,
  style,
  scale,
  pieSize,
  pieProperty,
  pieValue,
  colorScheme = d3.schemeCategory10,
}) => {
  const angleGenerator = d3
    .pie()
    .value((d) => d[pieValue])
    .padAngle(0.05);

  const arcGenerator = d3
    .arc()
    .innerRadius(scale(pieSize) / 2) // TODO: set 0 if smaller than threshold value
    .outerRadius(scale(pieSize));

  const pieData = angleGenerator(pieProperty);

  const color = d3.scaleOrdinal(colorScheme);

  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const scaledPie = d3.select(ref.current);

    scaledPie
      .attr("transform", `translate(${xy[0]},${xy[1]})`)
      .selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d) => color(d.data?.name))
      .attr("fill-opacity", style?.fill?.opacity ?? 1)
      .attr("stroke", style?.stroke?.color ?? style?.fill?.color ?? "black")
      .attr("stroke-opacity", style?.stroke?.opacity ?? 1)
      .attr("stroke-width", style?.stroke?.width ?? 0)
      .attr("stroke-linejoin", style?.stroke?.linejoin ?? "round");
  });

  return <g className="scaled-pie" ref={ref} />;
};

export default ScaledPie;
