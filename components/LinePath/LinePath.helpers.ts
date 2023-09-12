import { range } from "d3";
import { LinePathDatum } from "./LinePathBase";

/**
 * Fills all missing values (gaps) in a time series with 0s.
 * @param data The incomplete series.
 * @param x Accessor function for the x coordinate.
 * @param y Accessor function for the y coordinate.
 * @param minX The (new) beginn date for the filled series.
 * @param maxX The (new) end date for the filled series (inclusive).
 * @returns A series without gaps in time.
 */
export const getFilledSeries = <
  T extends Record<string, number | string | null | object> = LinePathDatum
>(
  data: T[],
  x = (d: T) => d.x,
  y = (d: T) => d.y,
  minX = 1950,
  maxX = new Date().getFullYear()
): LinePathDatum[] => {
  //TODOD: fix typing
  //@ts-expect-error object/string type in generic typing clashes with y: number in LinePathDatum
  return range(minX, maxX + 1).map((i) => {
    const entry = data.find((d) => x(d) === i);
    return {
      x: i,
      y: (entry && y(entry)) ?? 0,
    };
  });
};
