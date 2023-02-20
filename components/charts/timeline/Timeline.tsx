import type { FC } from "react";
import { Vector2 } from "three";

type Props = React.PropsWithChildren<{
  /** Where (within the parent element) should the timeline be positioned? */
  position?: Vector2;
}>;

/**
 * A wrapper components for a horizontal timeline off given dimensions.
 * @returns An svg group element, containing the timeline.
 */
const Timeline: FC<Props> = ({ position = new Vector2(), children }) => (
  <g transform={`translate(${position.x}, ${position.y})`}>{children}</g>
);

export default Timeline;
