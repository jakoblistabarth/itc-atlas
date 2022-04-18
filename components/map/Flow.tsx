import type { GeoProjection, ScaleLinear } from "d3";
import * as d3 from "d3";
import { Feature, Point } from "geojson";
import { FC } from "react";
import getFlowPoints from "../../lib/cartographic/getFlowPoints";
import { SymbolAppearance } from "../../types/SymbolAppearance";

const Flow: FC<{
  datum: Feature<Point>;
  projection: GeoProjection;
  scale: ScaleLinear<number, number>;
  style?: SymbolAppearance;
}> = ({ datum, scale, projection, style }) => {
  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(d3.curveBasis);

  return (
    <path
      markerEnd="url(#arrowHead)"
      opacity={style?.opacity ?? 0.8}
      d={line(getFlowPoints(datum, projection))}
      fill="none"
      stroke={style?.stroke?.color ?? style?.fill?.color ?? "black"}
      strokeWidth={scale(datum.properties?.value)}
      strokeLinejoin={style?.stroke?.linejoin ?? "round"}
    />
  );
};

export default Flow;
