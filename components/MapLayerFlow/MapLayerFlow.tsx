import { ScaleLinear } from "d3";
import { ComponentProps, FC } from "react";
import { OdMatrix } from "../../types/OdMatrix";
import MarkCircle from "../MarkCircle";
import Flow, { FlowStyleProps } from "../MarkFlow";
import MarkerArrowHead from "../MarkerArrowHead";
import Tooltip from "../Tooltip";
import KPI from "../KPI";
import { HiArrowRight } from "react-icons/hi";

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
        <Tooltip.Root key={feature.id}>
          <Tooltip.Content>
            <p>
              Airport:{" "}
              <span className="font-bold">{feature.properties.name}</span>
            </p>
          </Tooltip.Content>
          <Tooltip.Trigger asChild>
            <g>
              <MarkCircle
                key={feature.properties.name}
                longitude={feature.geometry.coordinates[0]}
                latitude={feature.geometry.coordinates[1]}
                radius={1}
                {...pointStyle}
              />
            </g>
          </Tooltip.Trigger>
        </Tooltip.Root>
      ))}
      {data.flows.features.map((feature) => (
        <Tooltip.Root key={feature.id} followCursor>
          <Tooltip.Content>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold">{feature.properties.o}</span>{" "}
                <HiArrowRight />{" "}
                <span className="font-bold">{feature.properties.d}</span>
              </div>
              <br />
              <KPI number={feature.properties.value} unit={"travels"} />
              <p>in 2019</p>
            </div>
          </Tooltip.Content>
          <Tooltip.Trigger asChild>
            <g>
              <Flow
                key={feature.properties.od}
                datum={feature}
                strokeWidthScale={scaleWidth}
                {...flowStyle}
              />
            </g>
          </Tooltip.Trigger>
        </Tooltip.Root>
      ))}
    </g>
  );
};

export default MapLayerFlow;
