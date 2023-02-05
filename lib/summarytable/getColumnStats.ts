import { ColumnDataType } from "./getColumnType";
import { mean, median, deviation } from "d3";

export type ColumnStats = {
  missing: number;
  mean?: number;
  median?: number;
  sd?: number;
};

const getColumnStats = (array: [], type: ColumnDataType): ColumnStats => {
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

export default getColumnStats;
