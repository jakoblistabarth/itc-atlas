import * as d3 from "d3";
import { ColumnStats, Datum } from "./DataFrame";

export enum ColumnType {
  Continuous = "continuous",
  Ordinal = "ordinal",
  Date = "date",
  Array = "array",
}

class Column {
  data: Datum[];
  type: ColumnType;
  label: string;
  stats: ColumnStats;

  constructor(data: any[], label: string) {
    this.data = data;
    this.type = this.getType();
    this.label = label;
    this.stats = this.getStats();
  }

  getType(): ColumnType {
    for (const value of this.data) {
      if (value == null) continue;
      if (typeof value === "number") return ColumnType.Continuous;
      if (Array.isArray(value)) return ColumnType.Array;
      if (typeof value === "string" && Date.parse(value))
        return ColumnType.Date;
      return ColumnType.Ordinal;
    }
    // if all are null, return ordinal
    return ColumnType.Ordinal;
  }

  getStats() {
    const missing =
      this.data.filter((d) => d === null || d === "").length / this.data.length;
    const isContinuous = this.type === ColumnType.Continuous;
    const mean = isContinuous
      ? (this.data.reduce(
          (acc: number, d) => (acc += d as number),
          0
        ) as number) / this.data.length
      : undefined;
    const median = isContinuous
      ? d3.median(this.data.map((d) => d as number))
      : undefined;
    const sd = isContinuous
      ? d3.deviation(this.data.map((d) => d as number))
      : undefined;
    return {
      missing: missing,
      mean: mean,
      median: median,
      sd: sd,
    };
  }
}

export default Column;
