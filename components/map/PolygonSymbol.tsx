import { FC, SVGProps, useState } from "react";
import { Feature } from "geojson";
import * as d3 from "d3";
import defaultTheme from "../../lib/styles/themes/defaultTheme";

type Props = {
  feature: Feature;
  projection: any;
} & Omit<SVGProps<SVGPathElement>, "d">;

const PolygonSymbol: FC<Props> = ({ feature, projection, ...rest }) => {
  const [hover, setHover] = useState(false);
  const path = d3.geoPath(projection);
  const featurePath = path(feature);
  if (!featurePath) return <></>;
  return (
    <path
      d={featurePath}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    />
  );
};

export default PolygonSymbol;
