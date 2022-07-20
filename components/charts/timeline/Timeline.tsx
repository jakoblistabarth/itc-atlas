import type { FC } from "react";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import { MapTheme } from "../../../types/MapTheme";
import { scaleTime, scalePoint } from "d3-scale";
import { TimelineEvent } from "../../../types/TimelineEvent";
import { nanoid } from "nanoid";
import Event from "./Event";
import TimelineGrid from "./TimelineGrid";
import { min, max, ascending } from "d3-array";

type Props = {
  position: [number, number];
  width: number;
  height: number;
  events: TimelineEvent[];
  domain?: [Date, Date];
  theme?: MapTheme;
  grid?: boolean;
};

/**
 * The Timeline components takes an Array of ```TimelineEvent```s to render a horizontal timeline off given dimensions.
 * @param Props Allows setting the position, the width, the height, the events, and optionally a custom domain, a theme and the visibility of the grid.
 * @returns An svg group element, containing the timeline.
 */
const Timeline: FC<Props> = ({
  position,
  width,
  height,
  events,
  domain,
  theme = defaultTheme,
  grid = false,
}) => {
  const margin = 20;

  const minDate = min(events.map((d) => d.dateStart)) ?? new Date("1950");
  const maxDate = max(events.map((d) => d.dateEnd)) ?? new Date();

  events.sort((a, b) =>
    ascending(new Date(a.dateStart), new Date(b.dateStart))
  );

  const xScale = scaleTime()
    .domain(domain ?? [minDate, maxDate])
    .range([margin, width - margin]);
  const yScale = scalePoint()
    .range([margin, height - margin])
    .domain(events.map((d) => d.yOffset));

  return (
    <g
      transform={`translate(${position[0]}, ${position[1]})`}
      fontFamily={theme.fontFamily ?? defaultTheme.fontFamily}
    >
      {grid && <TimelineGrid scale={xScale} height={height} />}
      {events.map((event) => {
        const dateStart = new Date(event.dateStart);
        const dateEnd = new Date(event.dateEnd);
        return (
          <Event
            key={nanoid()}
            position={[xScale(dateStart), yScale(event.yOffset) ?? 0]}
            width={xScale(dateEnd) - xScale(dateStart)}
            height={3}
            event={event}
          />
        );
      })}
    </g>
  );
};

export default Timeline;
