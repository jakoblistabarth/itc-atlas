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
  ].map((type) => {
    const baseColor = d3.color(type[1]);
    const colorCopy = _.clone(baseColor);
    if (colorCopy) colorCopy.opacity = 0.15;
    return [
      type[0] as ColumnType,
      {
        baseColor: baseColor?.formatRgb() ?? "rgb(100,100,100,)",
        brighter: colorCopy?.formatRgb() ?? "rgb(200,200,200,)",
      },
    ];
  })
);
