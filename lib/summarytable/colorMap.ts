import * as d3 from "d3";
import * as _ from "lodash";
import { ColumnDataType } from "../../lib/summarytable/getColumnType";

export const colorMap: Map<
  ColumnDataType,
  { baseColor: string; brighter: string }
> = new Map(
  [
    [ColumnDataType.Continuous, "rgb(255, 170, 25)"],
    [ColumnDataType.Ordinal, "rgba(255, 100, 100, 1)"],
    [ColumnDataType.Date, "rgba(200,0,55, 1)"],
    [ColumnDataType.Array, "rgba(130, 220, 255, 1)"],
  ].map((type) => {
    const baseColor = d3.color(type[1]);
    const colorCopy = _.clone(baseColor);
    if (colorCopy) colorCopy.opacity = 0.15;
    return [
      type[0] as ColumnDataType,
      {
        baseColor: baseColor?.formatRgb() ?? "rgb(100,100,100,)",
        brighter: colorCopy?.formatRgb() ?? "rgb(200,200,200,)",
      },
    ];
  })
);
