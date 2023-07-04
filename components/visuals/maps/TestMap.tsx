import { GeoGeometryObjects, geoPath } from "d3-geo";
import { FC, useContext } from "react";
import useSWR from "swr";
import BaseLayer from "../../../components/map/BaseLayer";
import { NeCountriesTopoJson } from "../../../types/NeTopoJson";
import { MapContext } from "../../map/layout/MapContext";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
};

const TestMap: FC<Props> = ({ neCountriesTopoJson }) => {
  const { projection, width, height } = useContext(MapContext);

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
      <BaseLayer countries={neCountriesTopoJson} projection={projection} />
      <path d={path(feature) ?? ""} fill="red" fillOpacity={0.2} stroke="red" />
    </>
  ) : (
    <text dx={width / 2} dy={height / 2} textAnchor="middle">
      Loading data…
    </text>
  );
};

export default TestMap;
