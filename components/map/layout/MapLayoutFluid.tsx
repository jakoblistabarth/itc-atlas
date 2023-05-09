import { FC, PropsWithChildren, createContext } from "react";
import useMeasure from "react-use-measure";
import getMapHeight from "../../../lib/cartographic/getMapHeight";
import {
  ExtendedFeature,
  ExtendedFeatureCollection,
  GeoGeometryObjects,
  GeoProjection,
} from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import { MapContext } from "./MapContext";

type Props = PropsWithChildren<{
  projection: GeoProjection;
  extent?: GeoGeometryObjects | ExtendedFeatureCollection | ExtendedFeature;
}>;

const MapLayoutFluid: FC<Props> = ({
  extent,
  projection = geoBertin1953(),
  children,
}) => {
  const [mapRef, { width }] = useMeasure();
  const options = extent ? { extent } : undefined;
  const height = getMapHeight(width, projection, options);

  return (
    <MapContext.Provider value={{ projection, width, height }}>
      <svg
        ref={mapRef}
        width={"100%"}
        height={"100%"}
        viewBox={`0 0 ${width} ${height}`}
      >
        {height && children}
      </svg>
    </MapContext.Provider>
  );
};

export default MapLayoutFluid;
