import { FC, useRef, useEffect } from "react";
import Vector2D from "../../lib/cartographic/vector2D";
import * as d3 from "d3";
import { GeoProjection, ScaleLinear } from "d3";
import { Flows } from "../../types/Flows";

const FlowLayer: FC<{
  data: Flows;
  projection: GeoProjection;
  scaleWidth: ScaleLinear<number, number>;
}> = ({ data, projection, scaleWidth }) => {
  const ref = useRef<SVGGElement>(null);

  const curvePoints = (
    a: [number, number],
    b: [number, number],
    bend: number = 0.3
  ) => {
    const start = projection(a);
    const end = projection(b);
    if (!start || !end) return;
    const v = new Vector2D(end[0] - start[0], end[1] - start[1]);
    const midPoint = new Vector2D(start[0], start[1]).plus(v.times(0.5));
    const controlPoint = midPoint.plus(v.getNormal().times(bend));
    const vStart = new Vector2D(
      controlPoint.dx - start[0],
      controlPoint.dy - start[1]
    );
    const vEnd = new Vector2D(
      controlPoint.dx - end[0],
      controlPoint.dy - end[1]
    );
    const offset = 3;
    const startPoint = new Vector2D(start[0], start[1])
      .plus(vStart.getUnitVector().times(offset))
      .toPoint();
    const endPoint = new Vector2D(end[0], end[1])
      .plus(vEnd.getUnitVector().times(offset))
      .toPoint();
    return [startPoint, controlPoint.toPoint(), endPoint];
  };

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
      .attr("d", (d) =>
        line(curvePoints(d.geometry.coordinates[0], d.geometry.coordinates[1]))
      )
      .attr("stroke", "red")
      .attr("fill", "none")
      .attr("stroke-width", (d) => scaleWidth(d.properties.value))
      .attr("opacity", 0.1)
      .attr("marker-end", "url(#arrowHead)");
  });

  return <g id="flow-Layer" ref={ref} />;
};

export default FlowLayer;
