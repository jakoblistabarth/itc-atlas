import { GeoProjection, ScaleLinear } from "d3";
import { FC } from "react";
import { OdMatrix } from "../../types/OdMatrix";
import type { Appearance } from "../../types/Appearance";
import Flow from "./Flow";
import PointSymbol from "./PointSymbol";
import ArrowHead from "../defs/marker/ArrowHead";
import { nanoid } from "nanoid";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { Vector2 } from "three";

const FlowLayer: FC<{
  data: OdMatrix;
  projection: GeoProjection;
  scaleWidth: ScaleLinear<number, number>;
  flowStyle?: Appearance;
  pointStyle?: Appearance;
}> = ({
  data,
  projection,
  scaleWidth,
  flowStyle = defaultTheme.flow,
  pointStyle = defaultTheme.symbol,
}) => {
  return (
    <g id="flow-Layer">
      <defs>
        <ArrowHead type={flowStyle?.markerEnd} color={flowStyle?.stroke} />
      </defs>
      {data.points.features.map((feature) => {
        const position = projection([
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
        ]);
        return (
          position && (
            <PointSymbol
              key={nanoid()}
              position={new Vector2(position[0], position[1])}
              radius={1}
              style={pointStyle}
            />
          )
        );
      })}
      {data.flows.features.map((feature) => (
        <Flow
          key={nanoid()}
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
