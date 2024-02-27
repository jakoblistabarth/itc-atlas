import { max, scaleSqrt } from "d3";
import { FC, useCallback, useState } from "react";
import MarkCircle from "../MarkCircle";
import type { GeoJsonProperties } from "geojson";
import Tooltip from "../Tooltip";
import KPI from "../KPI";

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
  const [hoverInfo, setHoverInfo] = useState<GeoJsonProperties | undefined>(
    undefined,
  );
  const onPointerEnterHandler = useCallback((properties: GeoJsonProperties) => {
    setHoverInfo(properties);
  }, []);
  const onPointerLeaveHandler = useCallback(() => setHoverInfo(undefined), []);
  const maxDomain = max(data.filter((d) => d.id).map((d) => d.value));
  const scaleSize = scaleSqrt()
    .domain([0, maxDomain ?? 1])
    .range([minRadius ?? 0, maxRadius ?? 20]);
  return (
    <Tooltip.Root open={!!hoverInfo} followCursor placement="top-start">
      <Tooltip.Trigger asChild>
        <g id="symbol-layer">
          {data.map((d) => {
            return (
              <MarkCircle
                key={d.id}
                latitude={d.latitude}
                longitude={d.longitude}
                radius={scaleSize(d.value)}
                interactive
                properties={{ NAME_EN: d.id, projectCount: d.value }}
                onPointerEnterHandler={onPointerEnterHandler}
                onPointerLeaveHandler={onPointerLeaveHandler}
              />
            );
          })}
        </g>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {hoverInfo && (
          <div>
            <KPI number={hoverInfo.projectCount} unit={"projects"} />
            {hoverInfo.NAME_EN}
          </div>
        )}
      </Tooltip.Content>
    </Tooltip.Root>
  );
};

export default MapLayerFlow;
