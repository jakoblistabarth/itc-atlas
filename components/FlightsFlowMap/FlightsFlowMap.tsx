import { max, min, scaleLinear } from "d3";
import { FC } from "react";
import { Vector2 } from "three";
import { itc_blue, itc_green } from "../../styles/theme";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { OdMatrix } from "../../types/OdMatrix";
import LabelPoint from "../LabelPoint";
import LegendFlow from "../LegendFlow";
import MapLayerBase from "../MapLayerBase";
import MapLayerFlow, { FlowPointStyleProps } from "../MapLayerFlow";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";
import { FlowStyleProps } from "../MarkFlow/";
import { getFlowPoints } from "../MarkFlow/MarkFlow.helpers";

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  odMatrix: OdMatrix;
};

const FlightsFlowMap: FC<Props> = ({ neCountriesTopoJson, odMatrix }) => {
  const { projection } = useMapLayoutContext();

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
      <MapLayerBase countries={neCountriesTopoJson} />
      <MapLayerFlow
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
            <LabelPoint
              key={d.properties.od}
              position={new Vector2(labelPosition[0], labelPosition[1])}
            >
              <tspan fontWeight="bold">{d.properties?.od}</tspan>(
              {d.properties?.value})
            </LabelPoint>
          )
        );
      })}
      <LegendFlow
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