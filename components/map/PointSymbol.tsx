import { FC, useRef, useEffect } from "react";
import * as d3 from "d3";
import { FeatureCollection, Point } from "geojson";
import { SymbolAppearance } from "../../types/SymbolAppearance";

const PointSymbol: FC<{
  data: FeatureCollection<Point>;
  projection: any;
  style?: SymbolAppearance;
  radius?: number;
}> = ({ data, projection, style, radius = 2 }) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const svgEl = d3.select(ref.current);

    const symbols = svgEl.append("g").attr("id", "symbols");
    const symbol = symbols.selectAll("circle").data(data);

    symbol
      .enter()
      .append("circle")
      .attr("cx", (d) => projection(d.geometry.coordinates)[0])
      .attr("cy", (d) => projection(d.geometry.coordinates)[1])
      .attr("r", (d) => radius)
      .attr("fill", style?.fill?.color ?? "black")
      .attr("fill-opacity", style?.fill?.opacity ?? 0.2)
      .attr("stroke", style?.stroke?.color ?? style?.fill?.color ?? "black")
      .attr("stroke-opacity", style?.stroke?.opacity ?? 0.8)
      .attr("stroke-width", style?.stroke?.width ?? 1)
      .attr("stroke-linejoin", style?.stroke?.linejoin ?? "round");
  });

  return <g id="point-Layer" ref={ref} />;
};

export default PointSymbol;
