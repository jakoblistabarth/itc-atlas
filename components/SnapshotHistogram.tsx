import * as d3 from "d3";
import { nanoid } from "nanoid";
import { FC } from "react";
import { colorMap } from "../lib/summarytable/colorMap";
import { fDateShort, fFloat, fPercentage } from "../lib/utilities/formaters";
import SnapshotCell from "./SnapshotCell";
import { SummaryTableColumn } from "../lib/summarytable/getSummaryTableColumn";
import { ColumnDataType } from "../lib/summarytable/getColumnType";
import Tooltip from "./Tooltip/Tooltip";
import TooltipContent from "./Tooltip/TooltipContent";
import { TooltipTrigger } from "./Tooltip/TooltipTrigger";

type Props = {
  column: SummaryTableColumn;
};

const SnapshotHistogram: FC<Props> = ({ column }) => {
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

  const isDate = column.type === ColumnDataType.Date;

  const columnNoNA = column.data.filter(
    (d: any) => d !== undefined && d !== null && d !== ""
  );
  const cleanedColumn = isDate
    ? columnNoNA.map((d: string) => new Date(d))
    : columnNoNA;

  const totalRows = column.data.length;

  // How does this actually work? TODO: type after figuring it out
  function thresholdTime(n: number) {
    return (column: SummaryTableColumn, min: number, max: number) => {
      return d3.scaleTime().domain([min, max]).ticks(n);
    };
  }

  const histogram = isDate ? d3.bin().thresholds(thresholdTime(10)) : d3.bin();
  const bins = histogram(cleanedColumn);

  const xDomain = [bins[0].x0 ?? 0, bins[bins.length - 1].x1 ?? 1];

  const yDomain = [0, d3.max(bins.map((d) => d.length)) ?? 1];

  const xScale = d3
    .scaleLinear()
    .domain(xDomain)
    .range([dimension.margin.side, dimension.width - dimension.margin.side]);

  const yScale = d3
    .scaleLinear()
    .domain(yDomain)
    .range([dimension.height - dimension.margin.bottom, dimension.margin.top]);

  const stats = [
    { name: "mean", label: "x̅", value: d3.mean(cleanedColumn as number[]) },
    { name: "median", label: "M", value: d3.median(cleanedColumn as number[]) },
  ];

  const tickFormat = isDate ? fDateShort : fFloat;
  const fontSize = 7;

  return (
    <svg width={dimension.width} height={dimension.height}>
      {bins.map((bin, idx) => {
        const nRows = bin.length;
        const ratio = nRows / totalRows;
        const rowLabel = nRows === 1 ? "row" : "rows";
        return (
          bin.x0 &&
          bin.x1 && (
            <Tooltip key={`tooltip-${column.name}-${idx}`}>
              <TooltipContent>
                <strong>
                  {tickFormat(bin.x0)}-{tickFormat(bin.x1)}
                </strong>
                <br />
                {nRows} {rowLabel}, {fPercentage(ratio)}
              </TooltipContent>
              <TooltipTrigger asChild>
                <g>
                  <SnapshotCell
                    key={nanoid()}
                    fill={colorMap.get(column.type)?.baseColor ?? "black"}
                    x={xScale(bin.x0) + dimension.barInset}
                    y={yScale(bin.length)}
                    width={
                      Math.max(0, xScale(bin.x1) - xScale(bin.x0)) -
                      dimension.barInset * 2
                    }
                    height={yScale(0) - yScale(bin.length)}
                    stroke={"none"}
                    strokeWidth={1}
                  />
                </g>
              </TooltipTrigger>
            </Tooltip>
          )
        );
      })}
      <g
        fontSize={fontSize}
        transform={`translate(0, ${
          dimension.height - dimension.margin.bottom
        })`}
      >
        <line
          x1={dimension.margin.side / 2}
          x2={dimension.width - dimension.margin.side / 2}
          y1={0}
          y2={0}
          stroke={"black"}
          strokeWidth={1}
        />
        <g transform={`translate(${dimension.margin.side / 2},0)`}>
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={2.5}
            stroke={"black"}
            strokeWidth={0.5}
          />
          <text dy={fontSize} y={2.5} textAnchor="start">
            {tickFormat(bins[0][0])}
          </text>
        </g>
        <g
          transform={`translate(${
            dimension.width - dimension.margin.side / 2
          },0)`}
        >
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={2.5}
            stroke={"black"}
            strokeWidth={0.5}
          />
          <text dy={fontSize} y={2.5} textAnchor="end">
            {tickFormat(bins[bins.length - 1][0])}
          </text>
        </g>
      </g>
      <g opacity={0.3}>
        {stats &&
          stats.map((stat, i) => (
            <line
              key={nanoid()}
              x1={xScale(stat.value ?? 0)}
              x2={xScale(stat.value ?? 0)}
              y1={dimension.height - dimension.margin.bottom}
              y2={0}
              stroke={"black"}
              strokeWidth={i % 2 ? "2px" : "1px"}
              strokeDasharray={i % 2 ? "0" : "1"}
            />
          ))}
      </g>
    </svg>
  );
};

export default SnapshotHistogram;
