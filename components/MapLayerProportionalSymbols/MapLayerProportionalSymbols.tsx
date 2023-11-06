import { max, scaleSqrt } from "d3";
import { FC } from "react";
import MarkCircle from "../MarkCircle";

type Props = {
  data: {
    latitude: number;
    longitude: number;
    value: number;
    id: string;
    label: string;
  }[];
  maxRadius?: number;
  minRadius?: number;
};

const MapLayerFlow: FC<Props> = ({ data, minRadius, maxRadius }) => {
  const maxDomain = max(data.filter((d) => d.id).map((d) => d.value));
  const scaleSize = scaleSqrt()
    .domain([0, maxDomain ?? 1])
    .range([minRadius ?? 0, maxRadius ?? 20]);
  return (
    <g id="symbol-layer">
      {data.map((d) => {
        return (
          <MarkCircle
            key={d.id}
            latitude={d.latitude}
            longitude={d.longitude}
            radius={scaleSize(d.value)}
            interactive
          />
        );
      })}
    </g>
  );
};

export default MapLayerFlow;
