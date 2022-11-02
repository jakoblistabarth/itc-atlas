import { geoPath, GeoProjection } from "d3-geo";
import { FC } from "react";
import { geoGraticule10 } from "d3";
import geoEquator from "../../lib/cartographic/geoEquator";
import geoCirclesLat from "../../lib/cartographic/geoCirclesLat";
import { MapTheme } from "../../types/MapTheme";
import defaultTheme from "../../lib/styles/themes/defaultTheme";

type Props = {
  projection: GeoProjection;
  theme?: MapTheme;
};

const Graticules: FC<Props> = ({ projection, theme = defaultTheme }) => {
  const path = geoPath(projection);
  const graticule = geoGraticule10();
  const graticulePath = path(graticule);
  const equatorPath = path(geoEquator);
  const circlesPath = path(geoCirclesLat);

  return (
    <>
      {graticulePath && (
        <g className="graticule">
          <path
            d={graticulePath}
            fill="none"
            stroke={theme.graticule.stroke}
            strokeWidth={theme.graticule.strokeWidth}
            strokeOpacity={theme.graticule.strokeOpacity}
          />
          {equatorPath && (
            <path
              d={equatorPath}
              fill={"none"}
              stroke={theme.graticule.stroke}
              strokeWidth={(theme.graticule.strokeWidth ?? 0.5) * 2}
            />
          )}
        </g>
      )}

      {circlesPath && (
        <path
          d={circlesPath}
          fill={"none"}
          stroke={theme.graticule.stroke}
          strokeDasharray="4, 2, 1, 2"
          strokeWidth={(theme.graticule.strokeWidth ?? 0.5) * 2}
        />
      )}
    </>
  );
};

export default Graticules;
