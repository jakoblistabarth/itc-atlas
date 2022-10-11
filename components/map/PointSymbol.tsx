import { FC } from "react";
import { Appearance } from "../../types/Appearance";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { Vector2 } from "three";

const PointSymbol: FC<{
  position: Vector2;
  style?: Appearance;
  radius?: number;
}> = ({ position, style, radius = 2 }) => {
  return (
    <circle
      cx={position.x}
      cy={position.y}
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
