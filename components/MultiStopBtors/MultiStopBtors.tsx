import { geoBertin1953 } from "d3-geo-projection";
import { FC } from "react";
import { BtorsGroupedByCountry } from "../../lib/data/queries/btors/getBtorsGroupedByCountry";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import MapLayerBase from "../MapLayerBase";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";
import MultiStopsLayer from "./MultiStopLayer";

type Props = {
  neCountries: NeCountriesTopoJson;
  btors: BtorsGroupedByCountry;
};

const MultiStopBtors: FC<Props> = ({ btors, neCountries }) => {
  const proj = geoBertin1953();

  return (
    <MapLayoutFluid projection={proj}>
      <MapLayerBase countries={neCountries} />
      <MultiStopsLayer btors={btors} />
    </MapLayoutFluid>
  );
};

export default MultiStopBtors;
