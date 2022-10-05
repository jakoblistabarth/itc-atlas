import type { FC } from "react";
import defaultTheme from "../../../lib/styles/themes/defaultTheme";
import { MapTheme } from "../../../types/MapTheme";
import { scaleTime, scalePoint, scaleSqrt } from "d3-scale";
import { TimelineEvent } from "../../../types/TimelineEvent";
import { nanoid } from "nanoid";
import EventPeriod from "./EventPeriod";
import TimelineGrid from "./TimelineGrid";
import { min, max, ascending } from "d3-array";
import EventPoint from "./EventPoint";

type Props = {
  position: [number, number];
  width: number;
  height: number;
  events: TimelineEvent[];
  domain?: [Date, Date];
  theme?: MapTheme;
  grid?: boolean;
  scaled?: boolean;
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
  scaled = false,
}) => {
  const margin = 20;

  const minStartDate = min(events.map((d) => d.dateStart)) ?? new Date("1950");
  const maxStartDate = max(events.map((d) => d.dateStart)) ?? new Date();
  const maxEndDate =
    max(events.map((d) => d.dateEnd ?? new Date())) ?? new Date();
  const hasEndDate = events.every((d) => d.dateEnd);

  events.sort((a, b) =>
    ascending(new Date(a.dateStart), new Date(b.dateStart))
  );

  const xScale = scaleTime()
    .domain(domain ?? [minStartDate, hasEndDate ? maxEndDate : maxStartDate])
    .range([margin, width - margin])
    .nice();
  const yScale = scalePoint()
    .range([margin, height - margin])
    .domain(events.map((d) => d.yOffset));
  const sizeMax = max(events, (d) => d.size);
  const sizeScale = scaleSqrt()
    .domain([0, sizeMax || 100])
    .range([0, height / (yScale.domain().length + 2)]);

  return (
    <g
      transform={`translate(${position[0]}, ${position[1]})`}
      fontFamily={theme.fontFamily ?? defaultTheme.fontFamily}
    >
      {grid && <TimelineGrid scale={xScale} height={height} />}
      {events.map((event) => {
        const dateStart = new Date(event.dateStart);
        const dateEnd = event.dateEnd ? new Date(event.dateEnd) : undefined;
        const width = dateEnd ? xScale(dateEnd) - xScale(dateStart) : 3;
        return dateEnd ? (
          <EventPeriod
            key={nanoid()}
            yOffset={yScale(event.yOffset) ?? 0}
            dateStart={dateStart}
            dateEnd={dateEnd}
            height={3}
            title={event.name}
            xScale={xScale}
          />
        ) : (
          <EventPoint
            key={nanoid()}
            yOffset={yScale(event.yOffset) ?? 0}
            date={event.dateStart}
            size={scaled ? sizeScale(event.size ?? 5) : 5}
            title={event.name}
            xScale={xScale}
            fill={event.fill ?? "black"}
            transparent
          />
        );
      })}
    </g>
  );
};

export default Timeline;
