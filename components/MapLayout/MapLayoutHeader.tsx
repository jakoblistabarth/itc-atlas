import type { FC } from "react";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { Bounds } from "../../types/MapOptions";
import { MapTheme } from "../../types/MapTheme";

type Props = {
  bounds: Bounds;
  title: string;
  theme?: MapTheme;
  subtitle?: string;
};

const MapLayoutHeader: FC<Props> = ({ bounds, theme, title, subtitle }) => {
  return (
    <g className="map-header" transform={`translate(${bounds.width / 2})`}>
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
