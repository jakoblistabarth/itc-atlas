import * as d3 from "d3";
import * as _ from "lodash";
import { ColumnType } from "../../types/Column";

export const colorMap: Map<
  ColumnType,
  { baseColor: string; brighter: string }
> = new Map(
  [
    [ColumnType.Contiuous, "rgb(255, 170, 25)"],
    [ColumnType.Ordinal, "rgba(255, 100, 100, 1)"],
    [ColumnType.Date, "rgba(200,0,55, 1)"],
    [ColumnType.Array, "rgba(130, 220, 255, 1)"],
    [ColumnType.Object, "rgba(40, 170, 225, 1)"],
  ].map((d) => {
    const baseColor = d3.color(d[1]);
    const colorCopy = _.clone(baseColor);
    if (colorCopy) colorCopy.opacity = 0.15;
    return [
      d[0],
      { baseColor: baseColor?.formatRgb(), brighter: colorCopy?.formatRgb() },
    ];
  })
);
