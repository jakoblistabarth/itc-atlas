import type { FC } from "react";
import { Vector2 } from "three";
import { TimelineContext } from "./TimelineContext";
import { ScaleTime } from "d3";

type Props = React.PropsWithChildren<{
  /** Where (within the parent element) should the timeline be positioned? */
  position?: Vector2;
  xScale: ScaleTime<number, number>;
}>;

// TODO: add context: height?,
// TODO: add Grid to timeline

/**
 * A wrapper components for a horizontal timeline off given dimensions.
 * @returns An svg group element, containing the timeline.
 */
const Timeline: FC<Props> = ({
  position = new Vector2(),
  xScale,
  children,
}) => (
  <TimelineContext.Provider
    value={{ left: position.x, top: position.y, xScale }}
  >
    <g transform={`translate(${position.x}, ${position.y})`}>{children}</g>
  </TimelineContext.Provider>
);

export default Timeline;
