import { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable";
import { ColumnType } from "../types/Column";
import { pctFormat } from "../lib/formaters";
import { Column } from "../types/DataFrame";

type Props = {
  column: Column;
  type: ColumnType;
};

const SnapshotBar: FC<Props> = ({ column, type }) => {
  const ref = useRef<HTMLDivElement>(null);

  const width = 200;
  const height = 30;
  const margin = {
    horizontal: 1,
    vertical: 1,
  };

  const innerHeight = height - margin.vertical * 2;
  const innerWidth = width - margin.horizontal * 2;

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
      d3.min(stack.map((d) => d.start)) ?? 0,
      d3.max(stack.map((d) => d.end)) ?? 100,
    ])
    .range([0, innerWidth]);

  const color = d3
    .scaleLinear()
    .domain(d3.extent(stack.map((d) => d.start)))
    .range([
      colorMap.get(type)?.baseColor ?? "black",
      colorMap.get(type)?.brighter ?? "lightgrey",
    ]);

  useEffect(() => {
    const svgContainer = d3.select(ref.current);

    const svgElement = svgContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const inner = svgElement
      .append("g")
      .attr("transform", `translate(${margin.horizontal},${margin.vertical})`);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("display", "none")
      .style("background-color", "white")
      .style("padding", "5px")
      .style("box-shadow", "0 0 5px rgba(0,0,0,.5")
      .style("font-size", "x-small");

    // This happens within useTooltip: const tooltip = d3.select("#tooltip")

    // const { mouseover, mousemove, mouseleave } = useTooltip({
    //   onShow: (event) =>  d3.select(event.target).style("stroke", "black"),
    //   onHide: (event) => d3.select(event.target).style("stroke", "none").style("opacity", 1),
    //   component: (d) => <><strong>{d.value}</strong><br />{pctFormat(d.cnt)}</>
    // })

    const mouseover = (event) => {
      tooltip.style("display", "inline"); // onShow()
      d3.select(event.target).style("stroke", "black");
    };
    const mousemove = (event, d) => {
      const tooltipHeight = tooltip.node()?.offsetHeight ?? 0;
      const tooltipWidth = tooltip.node()?.offsetWidth ?? 0;
      tooltip
        .style(
          "left",
          -tooltipWidth / 2 +
            d3.pointer(event, d3.select("body").node())[0] +
            "px"
        )
        .style(
          "top",
          d3.pointer(event, d3.select("body").node())[1] -
            tooltipHeight -
            5 +
            "px"
        )
        .html(`<strong>${d.value}</strong><br>${pctFormat(d.cnt)}`);
    };
    const mouseleave = (event) => {
      tooltip.style("display", "none"); // onHide();
      d3.select(event.target).style("stroke", "none").style("opacity", 1);
    };

    inner
      .selectAll("rect")
      .data(stack)
      .join("rect")
      .attr("x", (d) => x(d.start))
      .attr("y", 0)
      .attr("width", (d) => Math.abs(x(d.start) - x(d.end)))
      .attr("height", innerHeight)
      .attr("fill", (d) => color(d.start))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  });

  return <div ref={ref} />;
};

export default SnapshotBar;
