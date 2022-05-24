import { FC, useState } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable/colorMap";
import { ColumnType } from "../types/Column";
import { Column } from "../types/DataFrame";
import { nanoid } from "nanoid";
import { usePopperTooltip } from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";
import { fPercentage } from "../lib/utilities/formaters";
import { createStack } from "../lib/summarytable/stack";

type Props = {
  column: Column;
  type: ColumnType;
};

const SnapshotBar: FC<Props> = ({ column, type }) => {
  const [tooltipData, setTooltipData] = useState<
    Partial<ReturnType<typeof createStack>[number]>
  >({});

  const width = 200;
  const height = 30;
  const margin = {
    horizontal: 1,
    vertical: 1,
  };

  const innerHeight = height - margin.vertical * 2;
  const innerWidth = width - margin.horizontal * 2;

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

  // const tooltip = d3
  //   .select("body")
  //   .append("div")
  //   .attr("id", "tooltip")
  //   .style("position", "absolute")
  //   .style("display", "none")
  //   .style("background-color", "white")
  //   .style("padding", "5px")
  //   .style("box-shadow", "0 0 5px rgba(0,0,0,.5")
  //   .style("font-size", "x-small");

  // This happens within useTooltip: const tooltip = d3.select("#tooltip")

  // const { mouseover, mousemove, mouseleave } = useTooltip({
  //   onShow: (event) =>  d3.select(event.target).style("stroke", "black"),
  //   onHide: (event) => d3.select(event.target).style("stroke", "none").style("opacity", 1),
  //   component: (d) => <><strong>{d.value}</strong><br />{pctFormat(d.count)}</>
  // })

  // const mouseover = (event) => {
  //   tooltip.style("display", "inline"); // onShow()
  //   d3.select(event.target).style("stroke", "black");
  // };
  // const mousemove = (event, d) => {
  //   const tooltipHeight = tooltip.node()?.offsetHeight ?? 0;
  //   const tooltipWidth = tooltip.node()?.offsetWidth ?? 0;
  //   tooltip
  //     .style(
  //       "left",
  //       -tooltipWidth / 2 +
  //         d3.pointer(event, d3.select("body").node())[0] +
  //         "px"
  //     )
  //     .style(
  //       "top",
  //       d3.pointer(event, d3.select("body").node())[1] -
  //         tooltipHeight -
  //         5 +
  //         "px"
  //     )
  //     .html(`<strong>${d.value}</strong><br>${fPercentage(d.count)}`);
  // };
  // const mouseleave = (event) => {
  //   tooltip.style("display", "none"); // onHide();
  //   d3.select(event.target).style("stroke", "none").style("opacity", 1);
  // };

  //   inner
  //     .selectAll("rect")
  //     .data(stack)
  //     .join("rect")
  //     .attr("x", (d) => x(d.start))
  //     .attr("y", 0)
  //     .attr("width", (d) => Math.abs(x(d.start) - x(d.end)))
  //     .attr("height", innerHeight)
  //     .attr("fill", (d) => color(d.start))
  //     .on("mouseover", mouseover)
  //     .on("mousemove", mousemove)
  //     .on("mouseleave", mouseleave);
  // });

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ followCursor: true });

  return (
    <div ref={setTriggerRef}>
      {/* <button type="button" ref={setTriggerRef}>
        Trigger element
      </button> */}
      <svg width={width} height={height}>
        <g transform={`translate(${margin.horizontal},${margin.vertical})`}>
          {stack.map((d) => (
            <rect
              key={nanoid()}
              x={x(d.start)}
              y={0}
              width={Math.abs(x(d.start) - x(d.end))}
              height={innerHeight}
              fill={color(d.start)}
              onMouseOver={(e) => {
                setTooltipData(d);
                e.target.attributes.stroke = "black";
              }}
              onMouseLeave={() => null} //TODO: hide on mouseleave
            />
          ))}
        </g>
      </svg>
      {visible && tooltipData && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: "tooltip-container" })}
        >
          {tooltipData?.value || "no data set"}
          {tooltipData.count && (
            <span style={{ fontSize: "small", fontWeight: "bold" }}>
              {fPercentage(tooltipData.count)}
            </span>
          )}
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
        </div>
      )}
    </div>
  );
};

export default SnapshotBar;
