export enum ColumnDataType {
  Continuous = "continuous",
  Ordinal = "ordinal",
  Date = "date",
  Array = "array",
}

const getColumnType = (column: []) => {
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

export default getColumnType;
