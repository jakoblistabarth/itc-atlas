import type { FC } from "react";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { MapTheme } from "../../types/MapTheme";
import { useMapLayoutContext } from "./MapLayoutContext";

type Props = {
  title: string;
  theme?: MapTheme;
  subtitle?: string;
};

const MapLayoutHeader: FC<Props> = ({ theme, title, subtitle }) => {
  const { width } = useMapLayoutContext();
  return (
    <g className="map-header" transform={`translate(${width / 2})`}>
      <text
        fontFamily={theme?.fontFamily ?? defaultTheme.fontFamily}
        textAnchor="middle"
      >
        <tspan x={0} dy="1em" fontSize={"2em"}>
          {title}
        </tspan>
        {subtitle && (
          <tspan x={0} dy="1.4em">
            {subtitle}
          </tspan>
        )}
      </text>
    </g>
  );
};

export default MapLayoutHeader;
