import { geoBertin1953 } from "d3-geo-projection";
import { FC } from "react";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import type { OdMatrix } from "../../types/OdMatrix";
import FlightsFlowMap from "../FlightsFlowMap";
import MapLayoutFluid from "../MapLayout/MapLayoutFluid";

type Props = {
  odMatrix: OdMatrix;
  neCountriesTopoJson: NeCountriesTopoJson;
};

const Flights: FC<Props> = ({ odMatrix, neCountriesTopoJson }) => {
  return (
    <MapLayoutFluid projection={geoBertin1953()}>
      <FlightsFlowMap
        odMatrix={odMatrix}
        neCountriesTopoJson={neCountriesTopoJson}
      />
    </MapLayoutFluid>
  );
};

export default Flights;
