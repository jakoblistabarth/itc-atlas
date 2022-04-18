import { GeoProjection, ScaleLinear } from "d3";
import { FC } from "react";
import { ODMatrix } from "../../types/ODMatrix";
import type { SymbolAppearance } from "../../types/SymbolAppearance";
import Flow from "./Flow";
import PointSymbol from "./PointSymbol";

const FlowLayer: FC<{
  data: ODMatrix;
  projection: GeoProjection;
  scaleWidth: ScaleLinear<number, number>;
  flowStyle?: SymbolAppearance;
  pointStyle?: SymbolAppearance;
}> = ({ data, projection, scaleWidth, flowStyle, pointStyle }) => {
  return (
    <g id="flow-Layer">
      {data.points.features.map((feature) => (
        <PointSymbol
          xy={projection(feature.geometry.coordinates)}
          datum={feature}
          radius={1}
          style={pointStyle}
        />
      ))}
      {data.flows.features.map((feature) => (
        <Flow
          projection={projection}
          datum={feature}
          scale={scaleWidth}
          style={flowStyle}
        />
      ))}
    </g>
  );
};

export default FlowLayer;
