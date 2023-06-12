import { GeoProjection } from "d3";
import { FC } from "react";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import getTissotsIndicatrices from "../../lib/cartographic/getTissotsIndicatrices";
import { geoPath } from "d3-geo";

const TissotsIndicatricesLayer: FC<{
  projection: GeoProjection;
  radius: number;
  step?: number;
  fillColor?: string;
  strokeColor?: string;
  opacity?: number;
}> = ({
  projection,
  radius = 2.5,
  step,
  fillColor = defaultTheme.symbol?.fill,
  strokeColor = defaultTheme.symbol?.stroke,
  opacity,
}) => {
  const indicatrices = getTissotsIndicatrices(radius, step);
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

export default TissotsIndicatricesLayer;
