import { geoGraticule10 } from "d3";
import { geoPath } from "d3-geo";
import { FC, useId } from "react";
import geoCirclesLat from "../../lib/helpers/geoCirclesLat";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { MapTheme } from "../../types/MapTheme";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";
import { geoEquator } from "./MapLayerGraticule.helpers";

type Props = {
  theme?: MapTheme;
};

const MapLayerGraticule: FC<Props> = ({ theme = defaultTheme }) => {
  const { projection } = useMapLayoutContext();
  const path = geoPath(projection);
  const graticule = geoGraticule10();
  const graticulePath = path(graticule);
  const equatorPath = path(geoEquator);
  const circlesPath = path(geoCirclesLat);

  const id = useId();

  return (
    <g className="graticule" id={`graticules-${id}`}>
      {graticulePath && (
        <>
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
        </>
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
    </g>
  );
};

export default MapLayerGraticule;
