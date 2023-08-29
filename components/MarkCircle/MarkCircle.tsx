import { FC, SVGProps } from "react";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import toInt from "../../lib/utilities/toInt";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";

type Props = {
  lat: number;
  lng: number;
  radius?: number;
  isActive?: boolean;
  interactive?: boolean;
} & Omit<SVGProps<SVGCircleElement>, "cx" | "cy" | "r">;

const MarkCircle: FC<Props> = ({
  lat,
  lng,
  radius = 2,
  isActive = false,
  interactive = true,
  ...props
}) => {
  const { projection } = useMapLayoutContext();
  // TODO: create custom projection function which throws an error if coordinates have no projected position?
  // to avoid ?? [undefined]
  const [x, y] = projection([lng, lat]) ?? [undefined];
  const strokeWidth =
    toInt(props.strokeWidth) ?? defaultTheme.symbol?.strokeWidth ?? 1;
  return (
    <circle
      {...props}
      cx={x}
      cy={y}
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

export default MarkCircle;
