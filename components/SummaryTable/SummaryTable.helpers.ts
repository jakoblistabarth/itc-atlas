import { color, mean, median, deviation } from "d3";
import { clone } from "lodash";
import ColumnTable from "arquero/dist/types/table/column-table";

export enum ColumnDataType {
  Continuous = "continuous",
  Ordinal = "ordinal",
  Date = "date",
  Array = "array",
}

export type ColumnStats = {
  missing: number;
  mean?: number;
  median?: number;
  sd?: number;
};

export type SummaryTableColumn = ReturnType<typeof getSummaryTableColumn>;

export type SummaryTableData = SummaryTableColumn[] &
  ReturnType<typeof getSummaryTableDescription>;

export type SummaryTableDescription = {
  columnNames: string[];
  nColumns: number;
  nRows: number;
};

export const colorMap: Map<
  ColumnDataType,
  { baseColor: string; brighter: string }
> = new Map(
  [
    [ColumnDataType.Continuous, "rgb(255, 170, 25)"],
    [ColumnDataType.Ordinal, "rgba(255, 100, 100, 1)"],
    [ColumnDataType.Date, "rgba(200,0,55, 1)"],
    [ColumnDataType.Array, "rgba(130, 220, 255, 1)"],
  ].map((type) => {
    const baseColor = color(type[1]);
    const colorCopy = clone(baseColor);
    if (colorCopy) colorCopy.opacity = 0.15;
    return [
      type[0] as ColumnDataType,
      {
        baseColor: baseColor?.formatRgb() ?? "rgb(100,100,100,)",
        brighter: colorCopy?.formatRgb() ?? "rgb(200,200,200,)",
      },
    ];
  })
);

export const getColumnStats = (
  array: [],
  type: ColumnDataType
): ColumnStats => {
  const missing =
    array.filter((d) => d === null || d === "").length / array.length;
  const isContinuous = type === ColumnDataType.Continuous;
  const cMean = isContinuous ? mean(array.map((d) => d)) : undefined;
  const cMedian = isContinuous ? median(array.map((d) => d)) : undefined;
  const cSd = isContinuous ? deviation(array.map((d) => d)) : undefined;
  return {
    missing: missing,
    mean: cMean,
    median: cMedian,
    sd: cSd,
  };
};

export const getColumnType = (column: []) => {
  for (const value of column) {
    if (value == null) continue;
    if (typeof value === "number") return ColumnDataType.Continuous;
    if (Array.isArray(value)) return ColumnDataType.Array;
    if (
      (typeof value === "object" || typeof value === "string") &&
      Date.parse(value)
    )
      return ColumnDataType.Date;
    return ColumnDataType.Ordinal;
  }
  // if all are null, return ordinal
  return ColumnDataType.Ordinal;
};

export const getSummaryTableColumnDescription = (array: []) => {
  const type = getColumnType(array);
  return {
    type,
    stats: getColumnStats(array, type),
  };
};

export const getSummaryTableColumn = (tb: ColumnTable, name: string) => {
  const data = tb.array(name);
  const { type, stats } = getSummaryTableColumnDescription(data);
  return { data, name, type, stats };
};

export const getSummaryTableData = (tb: ColumnTable): SummaryTableData => {
  const columns = tb
    .columnNames()
    .map((name) => getSummaryTableColumn(tb, name));
  const tableDescription = getSummaryTableDescription(tb);
  return Object.assign(columns, { ...tableDescription });
};

export const getSummaryTableDescription = (
  tb: ColumnTable
): SummaryTableDescription => ({
  columnNames: tb.columnNames(),
  nColumns: tb.numCols(),
  nRows: tb.totalRows(),
});
