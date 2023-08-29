import { geoPath } from "d3";
import { Feature } from "geojson";
import { FC, SVGProps } from "react";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";

type Props = {
  feature: Feature;
} & Omit<SVGProps<SVGPathElement>, "d">;

const MarkGeometry: FC<Props> = ({ feature, ...rest }) => {
  const { projection } = useMapLayoutContext();
  const path = geoPath(projection);
  const featurePath = path(feature);
  if (!featurePath) return <></>;
  return <path d={featurePath} {...rest} />;
};

export default MarkGeometry;
