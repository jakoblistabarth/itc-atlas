import { GeoProjection } from "d3-geo";
import { FC } from "react";
import { setMapBounds } from "../../lib/helpers/getMapHeight";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { Bounds } from "../../types/MapOptions";
import { MapTheme } from "../../types/MapTheme";
import LayoutDebug from "./DebugLayout";
import { MapLayoutContext } from "./MapLayoutContext";
import { MapExtent } from "../../types/MapExtent";

type Props = React.PropsWithChildren<{
  bounds: Bounds;
  projection: GeoProjection;
  extent?: MapExtent;
  theme?: MapTheme;
  debug?: boolean;
}>;

const MapLayout: FC<Props> = ({
  bounds,
  projection,
  extent,
  theme = defaultTheme,
  debug = false,
  children,
}) => {
  const options = extent ? { extent } : undefined;
  setMapBounds(bounds, projection, options);
  return (
    <MapLayoutContext.Provider
      value={{
        projection,
        width: bounds.width,
        height: bounds.height ?? 300,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={bounds.width}
        height={bounds.height}
        fontFamily={theme.fontFamily ?? defaultTheme.fontFamily}
      >
        {children}
        {debug && <LayoutDebug bounds={bounds} />}
      </svg>
    </MapLayoutContext.Provider>
  );
};

export default MapLayout;
