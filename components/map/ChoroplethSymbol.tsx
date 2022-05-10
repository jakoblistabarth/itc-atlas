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
    // TODO: insert pattern defs here, remove from baselayer
    <path
      d={featurePath}
      fill={
        theme.choropleth?.pattern?.id
          ? `url(#${theme.choropleth?.pattern?.id})`
          : theme.choropleth?.fill
      }
      stroke={theme.choropleth?.stroke}
      strokeWidth={theme.choropleth?.strokeWidth}
      strokeLinejoin={theme.choropleth?.strokeLineJoin ?? "round"}
    />
  );
};

export default PointSymbol;
