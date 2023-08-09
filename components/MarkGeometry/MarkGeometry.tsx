import { FC, SVGProps } from "react";
import { Feature } from "geojson";
import { geoPath, GeoProjection } from "d3";

type Props = {
  feature: Feature;
  projection: GeoProjection;
} & Omit<SVGProps<SVGPathElement>, "d">;

const MarkGeometry: FC<Props> = ({ feature, projection, ...rest }) => {
  const path = geoPath(projection);
  const featurePath = path(feature);
  if (!featurePath) return <></>;
  return <path d={featurePath} {...rest} />;
};

export default MarkGeometry;
