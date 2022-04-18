import { FC, useRef, useEffect } from "react";
import * as d3 from "d3";
import { GeoProjection, ScaleLinear } from "d3";
import type { FeatureCollection, LineString } from "geojson";
import getFlowPoints from "../../lib/cartographic/getFlowPoints";
import type { SymbolAppearance } from "../../types/SymbolAppearance";

const FlowLayer: FC<{
  data: FeatureCollection<LineString>;
  projection: GeoProjection;
  scaleWidth: ScaleLinear<number, number>;
  style?: SymbolAppearance;
}> = ({ data, projection, scaleWidth, style }) => {
  const ref = useRef<SVGGElement>(null);

  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(d3.curveBasis);

  useEffect(() => {
    const svgEl = d3.select(ref.current);

    const routes = svgEl.append("g").attr("id", "routes");
    const flow = routes.selectAll("path").data(data.features);

    flow
      .enter()
      .append("path")
      .attr("d", (d) => line(getFlowPoints(d, projection)))
      .attr("stroke", style?.fill?.color ?? "black")
      .attr("fill", "none")
      .attr("stroke-width", (d) => scaleWidth(d.properties?.value))
      .attr("opacity", style?.fill?.opacity ?? 0.5)
      .attr("marker-end", "url(#arrowHead)");
  });

  return <g id="flow-Layer" ref={ref} />;
};

export default FlowLayer;
