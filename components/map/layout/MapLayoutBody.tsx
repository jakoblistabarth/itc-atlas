import type { FC } from "react";
import { Bounds } from "../../../types/MapOptions";

type Props = React.PropsWithChildren<{
  bounds: Bounds;
}>;

const MapLayoutBody: FC<Props> = ({ bounds, children }) => {
  return (
    <g
      className="map-body"
      transform={`translate(${bounds.frame?.left}, ${bounds.frame?.top})`}
    >
      {children}
    </g>
  );
};

export default MapLayoutBody;
