import { FC } from "react";
import { Feature, Point, Position } from "geojson";
import { SymbolAppearance } from "../../types/SymbolAppearance";

const PointSymbol: FC<{
  xy: Position;
  style?: SymbolAppearance;
  radius?: number;
}> = ({ xy, style, radius = 2 }) => {
  return (
    <circle
      cx={xy[0]}
      cy={xy[1]}
      r={radius}
      fill={style?.fill?.color ?? "black"}
      fillOpacity={style?.fill?.opacity ?? 0.2}
      stroke={style?.stroke?.color ?? style?.fill?.color ?? "black"}
      strokeOpacity={style?.stroke?.opacity ?? 0.8}
      strokeWidth={style?.stroke?.width ?? 1}
      strokeLinejoin={style?.stroke?.linejoin ?? "round"}
    />
  );
};

export default PointSymbol;
