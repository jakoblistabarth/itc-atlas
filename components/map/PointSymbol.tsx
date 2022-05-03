import { FC } from "react";
import { Position } from "geojson";
import { Appearance } from "../../types/Appearance";

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
      fill={style?.fill ?? "black"}
      fillOpacity={style?.fillOpacity ?? 0.2}
      stroke={style?.stroke ?? style?.fill ?? "black"}
      strokeOpacity={style?.strokeOpacity ?? 0.8}
      strokeWidth={style?.strokeWidth ?? 1}
      strokeLinejoin={style?.strokeLineJoin ?? "round"}
    />
  );
};

export default PointSymbol;
