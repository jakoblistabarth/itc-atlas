import { FC, useState } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable/colorMap";
import { ColumnType } from "../types/Column";
import { Column } from "../types/DataFrame";
import { nanoid } from "nanoid";
import { useFloating } from "@floating-ui/react-dom-interactions";
import { fPercentage } from "../lib/utilities/formaters";
import { createStack } from "../lib/summarytable/stack";
import SnapshotCell from "./SnapshotCell";

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

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(stack.map((d) => d.start)) ?? 0,
      d3.max(stack.map((d) => d.end)) ?? 100,
    ])
    .range([0, innerWidth]);

  const color = d3
    .scaleSequential([
      colorMap.get(type)?.baseColor ?? "black",
      colorMap.get(type)?.brighter ?? "lightgrey",
    ])
    .domain([
      d3.min(stack.map((d) => d.start)) ?? 0,
      d3.max(stack.map((d) => d.start)) ?? 1,
    ]);
  const [open, setOpen] = useState(false);
  const { x, y, reference, floating, strategy } = useFloating({
    open,
    onOpenChange: setOpen,
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.horizontal},${margin.vertical})`}>
          {stack.map((d) => (
            <SnapshotCell
              key={nanoid()}
              ref={reference} //TODO: fix ref for tooltip?
              x={xScale(d.start)}
              y={0}
              width={Math.abs(xScale(d.start) - xScale(d.end))}
              height={innerHeight}
              fill={color(d.start).toString()}
            />
          ))}
        </g>
      </svg>
      {open && (
        <div
          ref={floating}
          style={{
            position: strategy,
            top: y ?? "",
            left: x ?? "",
          }}
        >
          {tooltipData?.value || "no data set"}
          {tooltipData.count && (
            <span style={{ fontSize: "small", fontWeight: "bold" }}>
              {fPercentage(tooltipData.count)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SnapshotBar;
