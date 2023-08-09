import { GeoGeometryObjects, geoPath } from "d3-geo";
import { FC, useContext } from "react";
import useSWR from "swr";
import MapLayerBase from "../../MapLayerBase";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import { MapLayoutContext } from "../../MapLayout/MapLayoutContext";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
};

const TestMap: FC<Props> = ({ neCountriesTopoJson }) => {
  const { projection, width, height } = useContext(MapLayoutContext);

  const { data: aut } = useSWR("/api/data/elevationModel/Grossglockner");
  const [w, s, e, n] = aut ? aut?.bBox : [0, 0, 0, 0];
  const feature: GeoGeometryObjects = {
    type: "Polygon",
    coordinates: [
      [
        [n, w],
        [s, w],
        [s, e],
        [n, e],
        [n, w],
      ],
    ],
  };
  const path = geoPath(projection);

  return aut ? (
    <>
      <MapLayerBase countries={neCountriesTopoJson} projection={projection} />
      <path d={path(feature) ?? ""} fill="red" fillOpacity={0.2} stroke="red" />
    </>
  ) : (
    <text dx={width / 2} dy={height / 2} textAnchor="middle">
      Loading data…
    </text>
  );
};

export default TestMap;
