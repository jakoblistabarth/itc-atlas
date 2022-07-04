import * as d3 from "d3";
import { nanoid } from "nanoid";
import { FC } from "react";
import { colorMap } from "../lib/summarytable/colorMap";
import { fDateShort, fFloat } from "../lib/utilities/formaters";
import { ColumnType } from "../types/Column";
import type { Column, Datum } from "../types/DataFrame";
import SnapshotCell from "./SnapshotCell";

type Props = {
  column: Datum[];
  type: ColumnType;
};

const SnapshotHistogram: FC<Props> = ({ column, type }) => {
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

  // How does this actually work? TODO: type after figuring it out
  function thresholdTime(n: number) {
    return (column: Column, min: number, max: number) => {
      return d3.scaleTime().domain([min, max]).ticks(n);
    };
  }

  const histogram =
    type === ColumnType.Continuous
      ? d3.bin()
      : d3.bin().thresholds(thresholdTime(10));
  const bins = histogram(cleanedColumn);

  const xDomain = [bins[0].x0 ?? 0, bins[bins.length - 1].x1 ?? 1];

  const yDomain = [0, d3.max(bins.map((d) => d.length)) ?? 1];

  const x = d3
    .scaleLinear()
    .domain(xDomain)
    .range([dimension.margin.side, dimension.width - dimension.margin.side]);

  const y = d3
    .scaleLinear()
    .domain(yDomain)
    .range([dimension.height - dimension.margin.bottom, dimension.margin.top]);

  const stats = [
    { name: "mean", label: "x̅", value: d3.mean(cleanedColumn as number[]) },
    { name: "median", label: "M", value: d3.median(cleanedColumn as number[]) },
  ];

  const tickFormat = type === ColumnType.Continuous ? fFloat : fDateShort;
  const fontSize = 7;

  return (
    <svg width={dimension.width} height={dimension.height}>
      {bins.map(
        (bin) =>
          bin.x0 &&
          bin.x1 && (
            <SnapshotCell
              key={nanoid()}
              fill={colorMap.get(type)?.baseColor ?? "black"}
              x={x(bin.x0) + dimension.barInset}
              y={y(bin.length)}
              width={
                Math.max(0, x(bin.x1) - x(bin.x0)) - dimension.barInset * 2
              }
              height={y(0) - y(bin.length)}
              stroke={"none"}
              strokeWidth={1}
            />
          )
      )}
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
              x1={x(stat.value)}
              x2={x(stat.value)}
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
