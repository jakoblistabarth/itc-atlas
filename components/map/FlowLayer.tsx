import { FC, useRef, useEffect } from "react";
import Vector2D from "../../lib/cartographic/vector2D";
import * as d3 from "d3";

const FlowLayer: FC<{ flowData: any; projection: any }> = ({
  flowData,
  projection,
}) => {
  const ref = useRef<SVGGElement>(null);

  const curvePoints = (
    a: [string, string],
    b: [string, string],
    bend: number = 0.2
  ) => {
    const start = projection(a);
    const end = projection(b);
    const v = new Vector2D(end[0] - start[0], end[1] - start[1]);
    const midPoint = new Vector2D(start[0], start[1]).plus(
      v.getUnitVector().times(v.getMagnitude() / 2)
    );
    const controlPoint = midPoint.plus(v.getNormal().times(bend));
    return [start, controlPoint.toPoint(), end];
  };

  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(d3.curveNatural);

  useEffect(() => {
    const svgEl = d3.select(ref.current);

    const routes = svgEl.append("g").attr("id", "routes");
    const flow = routes.selectAll("path").data(flowData);

    flow
      .enter()
      .append("path")
      .attr("d", (d) => line(curvePoints(d.coordinates[0], d.coordinates[1])))
      .attr("stroke", "red")
      .attr("fill", "none")
      .attr("stroke-width", (d) => (10 * d.properties.value) / 100)
      .attr("opacity", (d) => 0.3)
      .attr("value", (d) => d.properties?.value)
      .attr("marker-end", "url(#arrowHead)");
  });

  return <g id="flow-Layer" ref={ref} />;
};

export default FlowLayer;
