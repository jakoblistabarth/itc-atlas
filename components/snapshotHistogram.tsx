import { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable";
import { ColumnType } from "../types/Column";
import { dateLongFormat, dateShortFormat, floatFormat } from "../lib/formaters";
import { Datum } from "../types/Table";
import { Bin } from "d3";

type Props = {
  column: Datum[];
  type: ColumnType;
};

const SnapshotHistogram: FC<Props> = ({ column, type }) => {
  const ref = useRef<HTMLDivElement>(null);

  const dimension = {
    width: 200,
    height: 30,
    barInset: 0.25,
    margin: {
      top: 1,
      side: 5,
      bottom: 11,
    },
  };

  const columnNoNA = column.filter(
    (d) => d !== undefined && d !== null && d !== ""
  );
  const cleanedColumn =
    type === ColumnType.Date ? columnNoNA.map((d) => new Date(d)) : columnNoNA;

  const typeFormat = type === ColumnType.Date ? dateLongFormat : floatFormat;
  // const min = d3.min(columnNoNA);
  // const max = d3.max(columnNoNA);

  function thresholdTime(n) {
    return (columnNoNA, min, max) => {
      return d3.scaleTime().domain([min, max]).ticks(n);
    };
  }

  const histogram =
    // type === ColumnType.Contiuous
    true ? d3.bin() : d3.bin().thresholds(thresholdTime(10));
  const bins = histogram(cleanedColumn);

  const xDomain = [bins[0].x0, bins[bins.length - 1].x1];

  const yDomain = [
    d3.min(bins.map((d) => d.length)),
    d3.max(bins.map((d) => d.length)),
  ];

  const x = d3
    .scaleLinear()
    .domain(xDomain)
    .range([dimension.margin.side, dimension.width - dimension.margin.side]);

  const y = d3
    .scaleLinear()
    .domain(yDomain)
    .range([dimension.height - dimension.margin.bottom, dimension.margin.top]);

  const stats = [
    { name: "mean", label: "x̅", value: d3.mean(cleanedColumn) },
    { name: "median", label: "M", value: d3.median(cleanedColumn) },
  ];

  useEffect(() => {
    const svgContainer = d3.select(ref.current);

    const svgElement = svgContainer
      .append("svg")
      .attr("width", dimension.width)
      .attr("height", dimension.height);

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

    const mouseover = (event: MouseEvent) => {
      tooltip.style("display", "inline");
      d3.select(event.target).attr("stroke", "black");
    };
    const mousemove = (event: MouseEvent, d: Bin<Datum, number>) => {
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
        .html(
          `<strong>${typeFormat(d.x0)}-${typeFormat(
            d.x1
          )}</strong><br>${floatFormat(d.length)} rows`
        );
    };
    const mouseleave = (event: MouseEvent) => {
      tooltip.style("display", "none");
      d3.select(event.target).attr("stroke", "none").style("opacity", 1);
    };

    // append the bar rectangles to the svg element
    svgElement
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.x0) + dimension.barInset)
      .attr("y", (d) => y(d.length))
      .attr(
        "width",
        (d) => Math.max(0, x(d.x1) - x(d.x0)) - dimension.barInset * 2
      )
      .attr("height", (d) => y(0) - y(d.length))
      .attr("fill", colorMap.get(type)?.baseColor ?? "black")
      .attr("stroke", "transparent")
      .attr("stroke-width", "1px");

    svgElement
      .append("g")
      .attr("id", "overlay")
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.x0) + dimension.barInset)
      .attr("y", dimension.margin.top)
      .attr(
        "width",
        (d) => Math.max(0, x(d.x1) - x(d.x0)) - dimension.barInset * 2
      )
      .attr(
        "height",
        dimension.height - dimension.margin.bottom - dimension.margin.top
      )
      .attr("fill-opacity", "0")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    const xAxis = svgElement
      .append("g")
      .attr(
        "transform",
        `translate(0,${dimension.height - dimension.margin.bottom})`
      )
      .call(
        d3
          .axisBottom(x)
          .tickValues(xDomain)
          .tickFormat(
            type === ColumnType.Contiuous ? floatFormat : dateShortFormat
          )
          .tickSize(2)
      )
      .attr("font-size", 7);

    xAxis.selectAll("text").attr("text-anchor", (d, i) => {
      return i % 2 ? "end" : "start";
    });

    const indicators = svgElement
      .append("g")
      .attr("opacity", 0.3)
      .selectAll("line")
      .data(stats)
      .join("line")
      .attr("x1", (d) => x(d.value))
      .attr("x2", (d) => x(d.value))
      .attr("y1", dimension.height - dimension.margin.bottom)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-width", (d, i) => `${i % 2 ? 2 : 1}px`)
      .attr("stroke-dasharray", (d, i) => `${i % 2 ? 0 : 1}`);
  });

  return <div ref={ref} />;
};

export default SnapshotHistogram;
