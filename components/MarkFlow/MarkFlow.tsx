import type { ScaleLinear } from "d3";
import * as d3 from "d3";
import { Feature, LineString } from "geojson";
import { FC, SVGProps } from "react";
import { getFlowPoints } from "./MarkFlow.helpers";
import { ArrowHeadShape } from "../MarkerArrowHead";
import { useMapLayoutContext } from "../MapLayout/MapLayoutContext";

export type FlowStyleProps = Omit<
  SVGProps<SVGPathElement>,
  "strokeWidth" | "markerEnd" | "markerStart" | "d"
> & { arrowShape?: ArrowHeadShape };

const MarkFlow: FC<
  {
    datum: Feature<LineString>;
    bend?: number;
    arrowShape?: ArrowHeadShape;
    strokeWidthScale: ScaleLinear<number, number>;
  } & FlowStyleProps
> = ({ datum, strokeWidthScale, bend, arrowShape = "tapered", ...rest }) => {
  const { projection } = useMapLayoutContext();
  const line = d3
    .line()
    .x((d) => d[0])
    .y((d) => d[1])
    .curve(d3.curveBasis);

  const flowPoints = getFlowPoints(datum, projection, bend);
  const linePath = flowPoints ? line(flowPoints) : null;

  return typeof linePath === "string" ? (
    <path
      markerEnd={`url(#${arrowShape})`}
      opacity={0.4}
      d={linePath}
      fill="none"
      stroke={"black"}
      strokeWidth={strokeWidthScale(datum.properties?.value)}
      strokeLinejoin={"round"}
      {...rest}
    />
  ) : (
    <></>
  );
};

export default MarkFlow;
