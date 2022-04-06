import { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable";
import { ColumnType } from "../types/Column";

type Props = {
  column: number[];
};

const SnapshotContinuous: FC<Props> = ({ column }) => {
  const ref = useRef<HTMLDivElement>(null);

  const width = 200;
  const height = 30;
  const margin = {
    top: 0,
    side: 15,
    bottom: 15,
  };

  const columnNoNA = column.filter(
    (d) => d !== undefined && d !== null && d !== "" && d != "null"
  );

  const histogram = d3.bin();
  const bins = histogram(columnNoNA);

  const yDomain = [
    d3.min(bins.map((d) => d.length)),
    d3.max(bins.map((d) => d.length)),
  ];
  const xDomain = [bins[0].x0, bins[bins.length - 1].x1];

  const x = d3
    .scaleLinear()
    .domain(xDomain)
    .range([0, width - 2 * margin.side]);

  const y = d3.scaleLinear().range([height - margin.bottom, 0]);
  y.domain(yDomain);

  const mean = d3.mean(columnNoNA);
  const median = d3.median(columnNoNA);

  useEffect(() => {
    const svgContainer = d3.select(ref.current).style("position", "relative");

    const svgElement = svgContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const inner = svgElement
      .append("g")
      .attr("transform", `translate(${margin.side},${margin.top})`);

    const tooltip = svgContainer
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("display", "none")
      .style("background-color", "white")
      .style("padding", "5px")
      .style("box-shadow", "0 0 5px rgba(0,0,0,.5")
      .style("font-size", "x-small");

    const mouseover = (event) => {
      tooltip.style("display", "inline");
      d3.select(event.target).style("stroke", "black");
    };
    const mousemove = (event, d) => {
      const tooltipHeight = tooltip.node()?.offsetHeight ?? 0;
      const tooltipWidth = tooltip.node()?.offsetWidth ?? 0;
      tooltip
        .style("left", -tooltipWidth / 2 + d3.pointer(event)[0] + "px")
        .style("top", d3.pointer(event)[1] - tooltipHeight - 5 + "px")
        .html(`<strong>${d.x0}-${d.x1}</strong><br>${d.length} rows`);
    };
    const mouseleave = (event) => {
      tooltip.style("display", "none");
      d3.select(event.target).style("stroke", "none").style("opacity", 1);
    };

    // append the bar rectangles to the svg element
    inner
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.x0) + 1)
      .attr("y", (d) => y(d.length))
      .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr("height", (d) => y(0) - y(d.length))
      .attr("fill", colorMap.get(ColumnType.Contiuous)?.baseColor ?? "black")
      .attr("stroke", "white")
      .attr("stroke-width", "1px")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    inner
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(xDomain))
      .attr("font-size", 7);

    const indicators = inner.append("g").attr("opacity", 0.3);
    indicators
      .append("line")
      .attr("x1", x(mean))
      .attr("x2", x(mean))
      .attr("y1", height - margin.bottom)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-width", "2px");

    indicators
      .append("line")
      .attr("x1", x(median))
      .attr("x2", x(median))
      .attr("y1", height - margin.bottom)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-width", "1px")
      .attr("stroke-dasharray", "1");
  });

  return <div ref={ref} />;
};

export default SnapshotContinuous;
