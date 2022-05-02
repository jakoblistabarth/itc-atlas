import * as d3 from "d3";
import * as _ from "lodash";
import { ColumnType } from "../../types/Column";
import type { Column } from "../../types/DataFrame";

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

export function getColumnStats(column: Column) {
  const type = getType(column);

  const missing =
    column.filter((d) => d === null || d === "").length / column.length;
  const isContinuous = type === ColumnType.Contiuous;
  const mean = isContinuous
    ? (column.reduce((acc: number, d: number) => (acc += d), 0) as number) /
      column.length
    : undefined;
  const median = isContinuous
    ? d3.median(column.map((d) => d as number))
    : undefined;
  const sd = isContinuous
    ? d3.deviation(column.map((d) => d as number))
    : undefined;
  return {
    missing: missing,
    mean: mean,
    median: median,
    sd: sd,
  };
}
