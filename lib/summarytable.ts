import * as d3 from "d3";

export default function getColumns(data: object[]) {
  const sample = data[0];
  const cols = Object.keys(sample);
  const col_data = cols.map((d) => {
    return {
      label: d === "" ? "unlabeled" : d,
      type: getType(data, d),
      stats: getColStats(data, d),
    };
  });
  const n_columns = col_data.length;
  const n_rows = data.length;
  return {
    col_data,
    n_columns,
    n_rows,
  };
}

function getType(data: object[], column: string) {
  for (const d of data) {
    const value = d[column];
    if (value == null) continue;
    if (typeof value === "number") return "continuous";
    if (value instanceof Date) return "date";
    return "ordinal";
  }
  // if all are null, return ordinal
  return "ordinal";
}

function getColStats(data: object[], column: string) {
  const type = getType(data, column);
  const pctFormat = d3.format(".1%");

  const missing =
    data.filter((d) => d[column] === null || d[column] === "").length /
    data.length;
  switch (type) {
    case "ordinal":
      return {
        missing: pctFormat(missing),
        mean: null,
        median: null,
        sd: null,
      };
    case "continuous": {
      const mean = data.reduce((acc, d) => acc + d[column], 0) / data.length;
      const median = d3.median(data.map((d) => d[column]));
      const sd = d3.deviation(data.map((d) => d[column]));
      return {
        missing: pctFormat(missing),
        mean,
        median,
        sd,
      };
    }
  }
}
