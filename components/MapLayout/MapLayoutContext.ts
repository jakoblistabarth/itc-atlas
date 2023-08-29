import { GeoProjection } from "d3-geo";
import { createContext, useContext } from "react";

type Context = {
  projection: GeoProjection;
  width: number;
  height: number;
};

export const MapLayoutContext = createContext<Context | null>(null);

export const useMapLayoutContext = () => {
  const context = useContext(MapLayoutContext);

  if (context == null) {
    throw new Error("Map components must be wrapped in <MapLayout />");
  }

  return context;
};
