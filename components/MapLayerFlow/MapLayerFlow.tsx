import { GeoProjection, ScaleLinear } from "d3";
import { ComponentProps, FC } from "react";
import { OdMatrix } from "../../types/OdMatrix";
import Flow, { FlowStyleProps } from "../MarkFlow";
import MarkCircle from "../MarkCircle";
import ArrowHead from "../MarkerArrowHead";
import { Vector2 } from "three";

export type FlowPointStyleProps = Omit<
  ComponentProps<typeof MarkCircle>,
  "position" | "radius"
>;

const MapLayerFlow: FC<{
  data: OdMatrix;
  projection: GeoProjection;
  scaleWidth: ScaleLinear<number, number>;
  flowStyle?: FlowStyleProps;
  pointStyle?: FlowPointStyleProps;
}> = ({ data, projection, scaleWidth, flowStyle, pointStyle }) => {
  return (
    <g id="flow-Layer">
      <defs>
        <ArrowHead
          shape={flowStyle?.arrowShape ?? "tip"}
          color={flowStyle?.stroke}
        />
      </defs>
      {data.points.features.map((feature) => {
        const position = projection([
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
        ]);
        return (
          position && (
            <MarkCircle
              key={feature.properties.name}
              position={new Vector2(position[0], position[1])}
              radius={1}
              {...pointStyle}
            />
          )
        );
      })}
      {data.flows.features.map((feature) => (
        <Flow
          key={feature.properties.od}
          projection={projection}
          datum={feature}
          strokeWidthScale={scaleWidth}
          {...flowStyle}
        />
      ))}
    </g>
  );
};

export default MapLayerFlow;
