import type { FC, SVGProps } from "react";
import { TimelineContext } from "./TimelineContext";
import { ScaleTime } from "d3";

type Props = React.PropsWithChildren<
  {
    left?: number;
    top?: number;
    xScale: ScaleTime<number, number>;
  } & SVGProps<SVGGElement>
>;

// TODO: add context: height?,
// TODO: add Grid to timeline

/**
 * A wrapper components for a horizontal timeline off given dimensions.
 * @returns An svg group element, containing the timeline.
 */
const Timeline: FC<Props> = ({ xScale, children, left = 0, top = 0 }) => (
  <TimelineContext.Provider value={{ left, top, xScale }}>
    <g transform={`translate(${left} ${top})`}>{children}</g>
  </TimelineContext.Provider>
);

export default Timeline;
