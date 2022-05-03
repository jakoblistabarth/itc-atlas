import { GeoProjection, ScaleLinear } from "d3";
import { FC } from "react";
import { ODMatrix } from "../../types/ODMatrix";
import type { Appearance } from "../../types/Appearance";
import Flow from "./Flow";
import PointSymbol from "./PointSymbol";

const FlowLayer: FC<{
  data: ODMatrix;
  projection: GeoProjection;
  scaleWidth: ScaleLinear<number, number>;
  flowStyle?: Appearance;
  pointStyle?: Appearance;
}> = ({ data, projection, scaleWidth, flowStyle, pointStyle }) => {
  return (
    <g id="flow-Layer">
      {data.points.features.map((feature) => {
        const position = projection([
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
        ]);
        return (
          position && (
            <PointSymbol xy={position} radius={1} style={pointStyle} />
          )
        );
      })}
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
