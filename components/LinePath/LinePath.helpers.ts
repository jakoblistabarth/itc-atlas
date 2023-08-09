import { range } from "d3";
import { LinePathDatum } from "./LinePathBase";

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
