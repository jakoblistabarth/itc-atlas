import { FC, useRef, useEffect } from "react";
import * as d3 from "d3";
import { ScaleLinear } from "d3";
import { fInt } from "../../lib/utilities/formaters";

const FlowLegend: FC<{
  data: number[];
  scaleWidth: ScaleLinear<number, number>;
  title: string;
  unitLabel: string;
}> = ({ data, scaleWidth, title, unitLabel }) => {
  const ref = useRef<SVGGElement>(null);

  const min = d3.min(data);
  const max = d3.max(data);
  if (!min || !max) return <g />;
  const entries = [min, max / 2, max];

  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1]);

  useEffect(() => {
    const svgEl = d3.select(ref.current);

    const entryGroup = svgEl.selectAll("g").data(entries);
    const entry = entryGroup
      .enter()
      .append("g")
      .attr("transform", (d, index) => `translate(10, ${index * 30})`);

    entry
      .append("path")
      .attr("d", (d) =>
        line([
          [0, 0],
          [80, 0],
        ])
      )
      .attr("stroke", "red")
      .attr("fill", "none")
      .attr("stroke-width", (d) => scaleWidth(d))
      .attr("opacity", 0.1)
      .attr("marker-end", "url(#arrowHead)");

    entry
      .append("text")
      .text((d) => (typeof d === "number" ? fInt(d) + " " + unitLabel : null))
      .attr("x", 100)
      .attr("font-size", 10)
      .attr("y", 10 / 4);
  });

  return (
    <g id="legend" transform="translate(0, 450)">
      <text fontFamily="Fraunces" fontWeight="bold">
        {title}
      </text>
      <g id="entries" ref={ref} transform="translate(0, 20)" />
    </g>
  );
};

export default FlowLegend;