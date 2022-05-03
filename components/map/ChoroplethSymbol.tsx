import { FC } from "react";
import { Feature } from "geojson";
import { Appearance } from "../../types/Appearance";
import { MapTheme } from "../../types/MapTheme";
import * as d3 from "d3";

const PointSymbol: FC<{
  feature: Feature;
  projection: any;
  style?: Appearance;
  theme: MapTheme;
}> = ({ feature, projection, style, theme }) => {
  const path = d3.geoPath(projection);
  const featurePath = path(feature);
  if (!featurePath) return <></>;
  return (
    <path
      d={featurePath}
      fill={`url(#${theme.choropleth?.pattern?.id})`}
      stroke={theme.choropleth?.stroke}
      strokeWidth={theme.choropleth?.strokeWidth}
      strokeLinejoin={theme.choropleth?.strokeLineJoin ?? "round"}
    />
  );
};

export default PointSymbol;
