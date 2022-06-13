import { FC } from "react";
import { Position } from "geojson";
import { Appearance } from "../../types/Appearance";
import defaultTheme from "../../lib/styles/themes/defaultTheme";

const PointSymbol: FC<{
  xy: Position;
  style?: Appearance;
  radius?: number;
}> = ({ xy, style, radius = 2 }) => {
  return (
    <circle
      cx={xy[0]}
      cy={xy[1]}
      r={radius}
      fill={style?.fill ?? defaultTheme.symbol?.fill}
      fillOpacity={style?.fillOpacity ?? defaultTheme.symbol?.fillOpacity}
      stroke={style?.stroke ?? defaultTheme.symbol?.stroke}
      strokeOpacity={style?.strokeOpacity ?? defaultTheme.symbol?.strokeOpacity}
      strokeWidth={style?.strokeWidth ?? defaultTheme.symbol?.strokeWidth}
      strokeLinejoin={style?.strokeLineJoin ?? "round"}
    />
  );
};

export default PointSymbol;
