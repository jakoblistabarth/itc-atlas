import { FC, useState } from "react";
import { Feature } from "geojson";
import { Appearance } from "../../types/Appearance";
import * as d3 from "d3";
import defaultTheme from "../../lib/styles/themes/defaultTheme";

const PolygonSymbol: FC<{
  feature: Feature;
  projection: any;
  style?: Appearance;
}> = ({ feature, projection, style = defaultTheme.choropleth }) => {
  const [hover, setHover] = useState(false);
  const path = d3.geoPath(projection);
  const featurePath = path(feature);
  if (!featurePath) return <></>;
  return (
    <path
      d={featurePath}
      fill={style?.fill}
      stroke={style?.stroke ?? style?.stroke}
      strokeWidth={hover ? 2 : style?.strokeWidth}
      strokeLinejoin={style?.strokeLineJoin ?? "round"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    />
  );
};

export default PolygonSymbol;
