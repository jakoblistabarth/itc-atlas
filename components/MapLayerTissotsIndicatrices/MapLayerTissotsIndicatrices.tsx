import { FC } from "react";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { getTissotsIndicatrices } from "./MapLayerTissotsIndicatrices.helpers";
import { geoPath } from "d3-geo";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";

const MapLayerTissotsIndicatrices: FC<{
  radius: number;
  step?: number;
  fillColor?: string;
  strokeColor?: string;
  opacity?: number;
}> = ({
  radius = 2.5,
  step,
  fillColor = defaultTheme.symbol?.fill,
  strokeColor = defaultTheme.symbol?.stroke,
  opacity,
}) => {
  const indicatrices = getTissotsIndicatrices(radius, step);
  const { projection } = useMapLayoutContext();
  const path = geoPath(projection);
  return (
    <g id="tissotIndicatrices-Layer" clipPath="url(#clip)">
      {indicatrices.features.map((tissotsIndex, idx) => {
        const featurePath = path(tissotsIndex);
        return (
          featurePath && (
            <path
              key={idx}
              d={featurePath}
              stroke={strokeColor}
              fill={fillColor}
              opacity={opacity ?? 0.2}
            />
          )
        );
      })}
    </g>
  );
};

export default MapLayerTissotsIndicatrices;
