import type { GeoProjection, ScaleLinear } from "d3";
import * as d3 from "d3";
import { Feature, LineString } from "geojson";
import { FC } from "react";
import getFlowPoints from "../../lib/cartographic/getFlowPoints";
import { SymbolAppearance } from "../../types/SymbolAppearance";

const Flow: FC<{
  datum: Feature<LineString>;
  projection: GeoProjection;
  scale: ScaleLinear<number, number>;
  style?: SymbolAppearance;
}> = ({ datum, scale, projection, style }) => {
  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(d3.curveBasis);

  const flowPoints = getFlowPoints(datum, projection);
  const linePath = flowPoints ? line(flowPoints) : null;

  return typeof linePath === "string" ? (
    <path
      markerEnd={`url(#${style?.markerEnd})`}
      opacity={style?.opacity ?? 0.8}
      d={linePath}
      fill="none"
      stroke={style?.stroke?.color ?? style?.fill?.color ?? "black"}
      strokeWidth={scale(datum.properties?.value)}
      strokeLinejoin={style?.stroke?.linejoin ?? "round"}
    />
  ) : (
    <></>
  );
};

export default Flow;
