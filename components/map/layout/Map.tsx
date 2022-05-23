import { GeoProjection } from "d3-geo";
import type { FC } from "react";
import { setMapBounds } from "../../../lib/cartographic/getMapHeight";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import { Bounds } from "../../../types/MapOptions";
import { MapTheme } from "../../../types/MapTheme";
import LayoutDebug from "./LaoutDebug";

type Props = React.PropsWithChildren<{
  bounds: Bounds;
  projection: GeoProjection;
  theme?: MapTheme;
  debug?: boolean;
}>;

const Map: FC<Props> = ({
  bounds,
  projection,
  theme = defaultTheme,
  debug = false,
  children,
}) => {
  setMapBounds(bounds, projection);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={bounds.width}
      height={bounds.height}
    >
      <g fontFamily={theme.fontFamily ?? defaultTheme.fontFamily}>{children}</g>
      {debug && <LayoutDebug bounds={bounds} />}
    </svg>
  );
};

export default Map;
