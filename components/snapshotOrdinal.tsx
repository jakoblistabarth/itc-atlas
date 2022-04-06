import { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable";
import { ColumnType } from "../types/Column";
import { pctFormat } from "../lib/formaters";
import { Column } from "../types/Table";

type Props = {
  column: any[];
};

const SnapshotOrdinal: FC<Props> = ({ column }) => {
  const ref = useRef<HTMLDivElement>(null);

  const width = 200;
  const height = 30;

  function createStack(column: Column) {
    const ColumnNoNA = column.filter(
      (d) => d !== undefined && d !== null && d !== "" && d != "null"
    );

    const frequencies = d3.rollup(
      ColumnNoNA,
      (v) => v.length,
      (d) => d
    );

    const total = ColumnNoNA.length;
    let cnt = 0;
    return Array.from(frequencies)
      .sort((a, b) => b[1] - a[1])
      .map((d) => ({
        value: d[0],
        cnt: d[1] / total,
        start: cnt / total,
        end: (cnt += d[1]) / total,
      }))
      .sort((a, b) => a.start - b.start);
  }

  const stack = createStack(column);

  const x = d3
    .scaleLinear()
    .domain([
      d3.min(stack.map((d) => d.start)),
      d3.max(stack.map((d) => d.end)),
    ])
    .range([0, width]);

  const color = d3
    .scaleLinear()
    .domain(d3.extent(stack.map((d) => d.start)))
    .range([
      colorMap.get(ColumnType.Ordinal)?.baseColor ?? "black",
      colorMap.get(ColumnType.Ordinal)?.brighter ?? "lightgrey",
    ]);

  useEffect(() => {
    const svgContainer = d3.select(ref.current).style("position", "relative");

    const svgElement = svgContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height);

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
        .html(`<strong>${d.value}</strong><br>${pctFormat(d.cnt)}`);
    };
    const mouseleave = (event) => {
      tooltip.style("display", "none");
      d3.select(event.target).style("stroke", "none").style("opacity", 1);
    };

    svgElement
      .selectAll("rect")
      .data(stack)
      .join("rect")
      .attr("x", (d) => x(d.start))
      .attr("y", 0)
      .attr("width", (d) => Math.abs(x(d.start) - x(d.end)))
      .attr("height", height)
      .attr("fill", (d) => color(d.start))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  });

  return <div ref={ref} />;
};

export default SnapshotOrdinal;
