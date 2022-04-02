import * as d3 from "d3";
import * as _ from "lodash";
import { ColumnType } from "../types/Column";
import { Column, TableDescription, Table } from "../types/Table";
// TODO:  split this file up in smaller chunks

export default function getTableDescription(table: Table): TableDescription {
  const sample = table[0];
  const cols = Object.keys(sample);
  const columns = cols.map((columnName) => {
    const column = table.map((row) => row[columnName]);
    return {
      label: columnName === "" ? "unlabeled" : columnName,
      type: getType(column),
      stats: getColumnStats(column),
      data: column,
    };
  });
  const nColumns = columns.length;
  const nRows = table.length;
  return {
    columns,
    nColumns,
    nRows,
  };
}

export const colorMap = new Map(
  [
    [ColumnType.Contiuous, "rgba(255,230, 0, 1)"],
    [ColumnType.Ordinal, "rgba(255, 100, 100, 1)"],
    [ColumnType.Date, "rgba(200,0,55, 1)"],
    [ColumnType.Array, "rgba(130, 220, 255, 1)"],
    [ColumnType.Object, "rgba(40, 170, 225, 1)"],
  ].map((d) => {
    const baseColor = d3.color(d[1]);
    const colorCopy = _.clone(baseColor);
    colorCopy.opacity = 0.6;
    return [
      d[0],
      { baseColor: baseColor.formatRgb(), brighter: colorCopy.formatRgb() },
    ];
  })
);

export function getType(column: Column): ColumnType {
  for (const value of column) {
    if (value == null) continue;
    if (typeof value === "number") return ColumnType.Contiuous;
    if (Array.isArray(value)) return ColumnType.Array;
    if (typeof value === "string" && Date.parse(value)) return ColumnType.Date;
    return ColumnType.Ordinal;
  }
  // if all are null, return ordinal
  return ColumnType.Ordinal;
}

function getColumnStats(column: Column) {
  const type = getType(column);

  const missing =
    column.filter((d) => d === null || d === "").length / column.length;
  const isContinuous = type === ColumnType.Contiuous;
  const mean = isContinuous
    ? column.reduce((acc: number, d: number) => acc + d, 0) / column.length
    : undefined;
  const median = isContinuous ? d3.median(column.map((d) => d)) : undefined;
  const sd = isContinuous ? d3.deviation(column.map((d) => d)) : undefined;
  return {
    missing: missing,
    mean: mean,
    median: median,
    sd: sd,
  };
}
