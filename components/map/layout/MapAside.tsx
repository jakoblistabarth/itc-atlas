import type { FC } from "react";

type Props = React.PropsWithChildren<{
  xOffset?: number;
  yOffset?: number;
}>;

const MapAside: FC<Props> = ({ xOffset, yOffset, children }) => {
  return (
    <g
      className="map-aside"
      transform={`translate(${xOffset ?? 0} , ${yOffset ?? 0})`}
    >
      {children}
    </g>
  );
};

export default MapAside;
