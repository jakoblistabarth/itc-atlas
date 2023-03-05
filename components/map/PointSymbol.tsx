import { FC, SVGProps, useState } from "react";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { Vector2 } from "three";
import toInt from "../../lib/utilities/toInt";

type Props = {
  position: Vector2;
  radius?: number;
  isActive?: boolean;
  interactive?: boolean;
} & Omit<SVGProps<SVGCircleElement>, "cx" | "cy" | "r">;

const PointSymbol: FC<Props> = ({
  position,
  radius = 2,
  isActive = false,
  interactive = true,
  ...props
}) => {
  const strokeWidth =
    toInt(props.strokeWidth) ?? defaultTheme.symbol?.strokeWidth ?? 1;
  return (
    <circle
      {...props}
      cx={position.x}
      cy={position.y}
      r={radius}
      fill={props.fill ?? defaultTheme.symbol?.fill}
      fillOpacity={props.fillOpacity ?? defaultTheme.symbol?.fillOpacity}
      stroke={props.stroke ?? defaultTheme.symbol?.stroke}
      strokeOpacity={props.strokeOpacity ?? defaultTheme.symbol?.strokeOpacity}
      strokeWidth={isActive ? strokeWidth * 4 : strokeWidth}
      cursor={interactive ? "pointer" : "inherit"}
      style={{
        ...props.style,
        transition: "stroke-width .75s",
      }}
    />
  );
};

export default PointSymbol;
