import { type FC, type PropsWithChildren } from "react";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { useMapLayoutContext } from "./MapLayoutContext";

type Props = PropsWithChildren<{
  centered?: boolean;
}>;

const MapLayoutHeader: FC<Props> = ({ centered, children }) => {
  const { width } = useMapLayoutContext();
  return (
    <g
      className="map-header"
      transform={`translate(${centered && width / 2})`}
      fontFamily={defaultTheme.fontFamily}
      textAnchor={centered ? "middle" : "start"}
    >
      {children}
    </g>
  );
};

export default MapLayoutHeader;
