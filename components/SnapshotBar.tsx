import { FC, useMemo, useState } from "react";
import * as d3 from "d3";
import { colorMap } from "../lib/summarytable/colorMap";
import { nanoid } from "nanoid";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react-dom-interactions";
import { fPercentage } from "../lib/utilities/formaters";
import { createStack } from "../lib/summarytable/stack";
import SnapshotCell from "./SnapshotCell";
import Tooltip from "./Tooltip";
import { SummaryTableColumn } from "../lib/summarytable/getSummaryTableColumn";

type Props = {
  column: SummaryTableColumn;
};

const SnapshotBar: FC<Props> = ({ column }) => {
  const [open, setOpen] = useState(false);
  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    placement: "top",
    middleware: [offset(10), flip(), shift()],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useDismiss(context),
    useHover(context, { restMs: 50 }),
  ]);

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

  const stack = useMemo(() => createStack(column.data), [column]);

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(stack.map((d) => d.start)) ?? 0,
      d3.max(stack.map((d) => d.end)) ?? 100,
    ])
    .range([0, innerWidth]);

  const color = d3
    .scaleSequential([
      colorMap.get(column.type)?.baseColor ?? "black",
      colorMap.get(column.type)?.brighter ?? "lightgrey",
    ])
    .domain([
      d3.min(stack.map((d) => d.start)) ?? 0,
      d3.max(stack.map((d) => d.start)) ?? 1,
    ]);

  const svgOnMouseOver = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    reference({
      getBoundingClientRect() {
        return {
          x: clientX,
          y: clientY,
          top: clientY,
          left: clientX,
          bottom: clientY,
          right: clientX,
          width: 0,
          height: 0,
        };
      },
    });
  };

  return (
    <div>
      <svg
        {...getReferenceProps({ ref: reference })}
        width={width}
        height={height}
        // onMouseEnter={() => {
        //   setOpen(true);
        // }}
        // onMouseOver={svgOnMouseOver}
        // onMouseLeave={() => {
        //   setOpen(false);
        // }}
        // TODO: Use VirtualElement, does not seem to working properly this way:
        // onMouseOver function might functions overrules the useHover hook?
      >
        <g transform={`translate(${margin.horizontal},${margin.vertical})`}>
          {stack.map((d) => (
            <SnapshotCell
              key={nanoid()}
              x={xScale(d.start)}
              y={0}
              width={Math.abs(xScale(d.start) - xScale(d.end))}
              height={innerHeight}
              fill={color(d.start).toString()}
              onMouseEnter={() => setTooltipData(d)}
            />
          ))}
        </g>
      </svg>
      {open && (
        <Tooltip
          {...getFloatingProps({ ref: floating })}
          style={{
            position: strategy,
            top: y ?? "",
            left: x ?? "",
          }}
        >
          {tooltipData?.value || "no data set"}
          {tooltipData.count && (
            <span
              style={{
                marginLeft: ".5em",
                fontSize: "small",
                fontWeight: "bold",
              }}
            >
              {fPercentage(tooltipData.count)}
            </span>
          )}
        </Tooltip>
      )}
    </div>
  );
};

export default SnapshotBar;
