import { ScaleLinear } from "d3";
import { ComponentProps, FC } from "react";
import { OdMatrix } from "../../types/OdMatrix";
import MarkCircle from "../MarkCircle";
import Flow, { FlowStyleProps } from "../MarkFlow";
import MarkerArrowHead from "../MarkerArrowHead";

export type FlowPointStyleProps = Omit<
  ComponentProps<typeof MarkCircle>,
  "latitude" | "longitude" | "radius"
>;

type Props = {
  data: OdMatrix;
  scaleWidth: ScaleLinear<number, number>;
  flowStyle?: FlowStyleProps;
  pointStyle?: FlowPointStyleProps;
};

const MapLayerFlow: FC<Props> = ({
  data,
  scaleWidth,
  flowStyle,
  pointStyle,
}) => {
  return (
    <g id="flow-Layer">
      <defs>
        <MarkerArrowHead
          shape={flowStyle?.arrowShape ?? "tapered"}
          color={flowStyle?.stroke}
        />
      </defs>
      {data.points.features.map((feature) => (
        <MarkCircle
          key={feature.properties.name}
          longitude={feature.geometry.coordinates[0]}
          latitude={feature.geometry.coordinates[1]}
          radius={1}
          {...pointStyle}
        />
      ))}
      {data.flows.features.map((feature) => (
        <Flow
          key={feature.properties.od}
          datum={feature}
          strokeWidthScale={scaleWidth}
          {...flowStyle}
        />
      ))}
    </g>
  );
};

export default MapLayerFlow;
