import { max, min, scaleLinear } from "d3";
import { FC, useContext } from "react";
import { Vector2 } from "three";
import getFlowPoints from "../lib/cartographic/getFlowPoints";
import { itc_blue, itc_green } from "../styles/theme";
import { NeCountriesTopoJson } from "../types/NeTopoJson";
import { OdMatrix } from "../types/OdMatrix";
import BaseLayer from "./map/BaseLayer";
import { FlowStyleProps } from "./map/Flow";
import FlowLayer, { FlowPointStyleProps } from "./map/FlowLayer";
import FlowLegend from "./map/FlowLegend";
import PointLabel from "./map/PointLabel";
import { MapContext } from "./map/layout/MapContext";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  odMatrix: OdMatrix;
};

const FlightsFlowMap: FC<Props> = ({ neCountriesTopoJson, odMatrix }) => {
  const { width, height, projection } = useContext(MapContext);

  const flightsPerRoute = odMatrix.flows.features.map(
    (flow) => flow.properties?.value
  );
  const minCount = min(flightsPerRoute);
  const maxCount = max(flightsPerRoute);
  const scaleWidth = scaleLinear()
    .domain([minCount ?? 0, maxCount ?? 1])
    .range([1, 15]);

  const flowStyle: FlowStyleProps = {
    stroke: itc_green,
    opacity: 0.2,
    arrowShape: "tip",
  };
  const pointStyle: FlowPointStyleProps = {
    fill: itc_blue,
    fillOpacity: 1,
    stroke: "none",
  };

  return (
    <>
      <BaseLayer countries={neCountriesTopoJson} projection={projection} />
      <FlowLayer
        projection={projection}
        data={odMatrix}
        scaleWidth={scaleWidth}
        flowStyle={flowStyle}
        pointStyle={pointStyle}
      />

      {odMatrix.flows.features.slice(0, 5).map((d) => {
        const flowPoints = getFlowPoints(d, projection);
        const labelPosition = flowPoints?.[1];
        return (
          labelPosition && (
            <PointLabel
              key={d.properties.od}
              position={new Vector2(labelPosition[0], labelPosition[1])}
            >
              <tspan fontWeight="bold">{d.properties?.od}</tspan>(
              {d.properties?.value})
            </PointLabel>
          )
        );
      })}
      <FlowLegend
        data={odMatrix.flows.features.map((flow) => flow.properties?.value)}
        scaleWidth={scaleWidth}
        title="No. of flights in 2019"
        unitLabel="flights"
        flowStyle={flowStyle}
      />
    </>
  );
};

export default FlightsFlowMap;
