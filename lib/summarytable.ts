import * as d3 from "d3";
import * as _ from "lodash";
// TODO:  split this file up in smaller chunks

// TODO: move to types folder
export type ColumnType = "continuous" | "date" | "ordinal" | "array";

export const pctFormat = d3.format(".1%");
export const floatFormat = d3.format(".4");

export default function getColumns(data: object[]) {
  const sample = data[0];
  const cols = Object.keys(sample);
  const columnsData = cols.map((d) => {
    return {
      label: d === "" ? "unlabeled" : d,
      type: getType(data.map((row) => row[d])),
      stats: getColumnStats(data, d),
      data: data.map((record) => record.d),
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
    ["continuous", "rgba(255,230, 0, 1)"],
    ["ordinal", "rgba(255, 100, 100, 1)"],
    ["date", "rgba(200,0,55, 1)"],
    ["array", "rgba(130, 220, 255, 1)"],
    ["object", "rgba(40, 170, 225, 1)"],
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

export function getType(data: object[]): ColumnType {
  for (const value of data) {
    if (value == null) continue;
    if (typeof value === "number") return "continuous";
    if (Array.isArray(value)) return "array";
    if (typeof value === "string" && Date.parse(value)) return "date";
    return "ordinal";
  }
  // if all are null, return ordinal
  return "ordinal";
}

function getColumnStats(data: object[], column: string) {
  const type = getType(data, column);

  const missing =
    data.filter((d) => d[column] === null || d[column] === "").length /
    data.length;
  if (type === "continuous") {
    const mean = data.reduce((acc, d) => acc + d[column], 0) / data.length;
    const median = d3.median(data.map((d) => d[column]));
    const sd = d3.deviation(data.map((d) => d[column]));
    return {
      missing: missing,
      mean: mean,
      median: median,
      sd: sd,
    };
  } else {
    return {
      missing: missing,
      mean: null,
      median: null,
      sd: null,
    };
  }
}
