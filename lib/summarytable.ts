import * as d3 from "d3";
import { median } from "d3";
import * as _ from "lodash";
import { mean } from "lodash";

export type DataType = "continuous" | "date" | "ordinal" | "array";

export default function getColumns(data: object[]) {
  const sample = data[0];
  const cols = Object.keys(sample);
  const columnsData = cols.map((d) => {
    return {
      label: d === "" ? "unlabeled" : d,
      type: getType(data, d),
      stats: getColumnStats(data, d),
    };
  });
  const n_columns = columnsData.length;
  const n_rows = data.length;
  return {
    columnsData,
    n_columns,
    n_rows,
  };
}

export const colorMap = new Map(
  [
    ["ordinal", "rgba(80, 100, 170, 1)"],
    ["continuous", "rgba(240, 150, 45, 1)"],
    ["date", "rgba(225,90,90, 1)"],
    ["array", "rgb(200, 200, 200)"],
  ].map((d) => {
    const baseColor = d3.color(d[1]);
    const colorCopy = _.clone(baseColor);
    colorCopy.opacity = 0.6;
    return [
      d[0],
      { color: baseColor.formatRgb(), brighter: colorCopy.formatRgb() },
    ];
  })
);

function getType(data: object[], column: string): DataType {
  for (const d of data) {
    const value = d[column];
    if (value == null) continue;
    if (typeof value === "number") return "continuous";
    if (value instanceof Date) return "date";
    if (Array.isArray(value)) return "array";
    return "ordinal";
  }
  // if all are null, return ordinal
  return "ordinal";
}

function getColumnStats(data: object[], column: string) {
  const type = getType(data, column);
  const pctFormat = d3.format(".1%");
  const floatFormat = d3.format(".4");

  const missing =
    data.filter((d) => d[column] === null || d[column] === "").length /
    data.length;
  if (type === "continuous") {
    const mean = data.reduce((acc, d) => acc + d[column], 0) / data.length;
    const median = d3.median(data.map((d) => d[column]));
    const sd = d3.deviation(data.map((d) => d[column]));
    return {
      missing: pctFormat(missing),
      mean: floatFormat(mean),
      median: floatFormat(median),
      sd: floatFormat(sd),
    };
  } else {
    return {
      missing: pctFormat(missing),
      mean: null,
      median: null,
      sd: null,
    };
  }
}
