import { FC, useRef, useEffect } from "react";
import * as d3 from "d3";

const PointLayer: FC<{
  data: any;
  projection: any;
  radius: number;
  color: string;
}> = ({ data, projection, radius, color }) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const svgEl = d3.select(ref.current);

    const points = svgEl.append("g").attr("id", "points");
    const point = points.selectAll("circle").data(data);

    point
      .enter()
      .append("circle")
      .attr("cx", (d) => projection(d.coordinates)[0])
      .attr("cy", (d) => projection(d.coordinates)[1])
      .attr("r", radius)
      .attr("fill", color);

    const fontSize = 10;
    const labels = points.selectAll("text").data(data.slice(0, 5));
    labels
      .enter()
      .append("text")
      .text((d) => d.name)
      .attr("font-size", fontSize)
      .attr("font-weight", "bold")
      .attr("x", (d) => projection(d.coordinates)[0] + 5)
      .attr("y", (d) => projection(d.coordinates)[1] + fontSize / 4)
      .attr("stroke", "#E3E3E3")
      .attr("stroke-width", 2)
      .attr("paint-order", "stroke")
      .attr("stroke-linejoin", "round")
      .attr("fill", color);
  });

  return <g id="point-Layer" ref={ref} />;
};

export default PointLayer;
