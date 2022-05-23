import type { GeoProjection, ScaleLinear } from "d3";
import * as d3 from "d3";
import { Feature, LineString } from "geojson";
import { FC } from "react";
import getFlowPoints from "../../lib/cartographic/getFlowPoints";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import { Appearance } from "../../types/Appearance";

const Flow: FC<{
  datum: Feature<LineString>;
  projection: GeoProjection;
  bend?: number;
  scale: ScaleLinear<number, number>;
  style?: Appearance;
}> = ({ datum, scale, bend, projection, style }) => {
  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(d3.curveBasis);

  const flowPoints = getFlowPoints(datum, projection, bend);
  const linePath = flowPoints ? line(flowPoints) : null;

  return typeof linePath === "string" ? (
    <path
      markerEnd={`url(#${style?.markerEnd ?? defaultTheme.flow?.markerEnd})`}
      opacity={style?.opacity ?? 0.8}
      d={linePath}
      fill="none"
      stroke={style?.stroke ?? style?.fill ?? "black"}
      strokeWidth={scale(datum.properties?.value)}
      strokeLinejoin={style?.strokeLineJoin ?? "round"}
    />
  ) : (
    <></>
  );
};

export default Flow;
