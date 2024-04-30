import { max, min, scaleLinear } from "d3";
import { FC } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.js";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { OdMatrix } from "../../types/OdMatrix";
import LegendFlow from "../LegendFlow";
import MapLayerBase from "../MapLayerBase";
import MapLayerFlow, { FlowPointStyleProps } from "../MapLayerFlow";
import { FlowStyleProps } from "../MarkFlow/";

const twConfig = resolveConfig(tailwindConfig);

type Props = {
  neCountriesTopoJson: NeCountriesTopoJson;
  odMatrix: OdMatrix;
};

const FlightsFlowMap: FC<Props> = ({ neCountriesTopoJson, odMatrix }) => {
  const flightsPerRoute = odMatrix.flows.features.map(
    (flow) => flow.properties?.value,
  );
  const minCount = min(flightsPerRoute);
  const maxCount = max(flightsPerRoute);
  const scaleWidth = scaleLinear()
    .domain([minCount ?? 0, maxCount ?? 1])
    .range((maxCount ?? 1) > 20 ? [1, 15] : [1, 5]);

  const flowStyle: FlowStyleProps = {
    // @ts-expect-error TODO: refactor to get rid of styleProp
    stroke: twConfig.theme?.colors?.["itc-green"]?.DEFAULT,
    opacity: 0.2,
  };
  const pointStyle: FlowPointStyleProps = {
    // @ts-expect-error TODO: refactor to get rid of styleProp
    fill: twConfig.theme?.colors?.["itc-blue"].DEFAULT,
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
