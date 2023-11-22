import * as d3 from "d3";
import { FC } from "react";
import { fInt, fPercentage } from "../../lib/utilities/formaters";
import {
  SummaryTableColumn,
  colorMap,
} from "../SummaryTable/SummaryTable.helpers";
import Tooltip from "../Tooltip/";
import { createStack } from "./Snapshot.helpers";
import SnapshotCell from "./SnapshotCell";

type Props = {
  column: SummaryTableColumn;
};

const SnapshotBar: FC<Props> = ({ column }) => {
  const width = 200;
  const height = 30;
  const margin = {
    horizontal: 1,
    vertical: 1,
  };

  const innerHeight = height - margin.vertical * 2;
  const innerWidth = width - margin.horizontal * 2;

  const total = column.data.length;
  const stack = createStack(column.data);

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

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.horizontal},${margin.vertical})`}>
          {stack.map((d, idx) => {
            const nRows = Math.ceil(total * d.count);
            const rowLabel = nRows === 1 ? "row" : "rows";
            const text = String(d.value);
            return (
              <Tooltip.Root key={`tooltip-${column.name}-${idx}`}>
                <Tooltip.Content>
                  <strong>{text}</strong>
                  <br />
                  {fInt(nRows)} {rowLabel}, {fPercentage(d.count)}
                </Tooltip.Content>
                <Tooltip.Trigger asChild>
                  <g>
                    <SnapshotCell
                      x={xScale(d.start)}
                      y={0}
                      width={Math.abs(xScale(d.start) - xScale(d.end))}
                      height={innerHeight}
                      fill={color(d.start).toString()}
                    />
                  </g>
                </Tooltip.Trigger>
              </Tooltip.Root>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default SnapshotBar;
