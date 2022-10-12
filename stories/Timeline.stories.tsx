import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Timeline from "../components/charts/timeline/Timeline";
import { TimelineEvent } from "../types/TimelineEvent";
import PointLabel from "../components/map/PointLabel";
import EventPoint from "../components/charts/timeline/EventPoint";
import { nanoid } from "nanoid";
import TimelineGrid from "../components/charts/timeline/TimelineGrid";
import { extent, scalePoint, scaleTime } from "d3";
import { Vector2 } from "three";
import { LabelPlacement } from "../types/LabelPlacement";
import { fDateShort } from "../lib/utilities/formaters";

const events: TimelineEvent[] = [
  {
    name: "a",
    yOffset: "a",
    dateStart: new Date("1993"),
    dateEnd: new Date("2003"),
  },
  {
    name: "b",
    yOffset: "b",
    dateStart: new Date("1900"),
    dateEnd: new Date("2000"),
  },
  {
    name: "c",
    yOffset: "c",
    dateStart: new Date("2000"),
    dateEnd: new Date("2022"),
  },
  {
    name: "a2",
    yOffset: "a",
    dateStart: new Date("2012"),
    dateEnd: new Date("2022"),
  },
];

const eventsScaled: TimelineEvent[] = [
  {
    name: "a",
    yOffset: "a",
    dateStart: new Date("1993"),
    size: 30,
  },
  {
    name: "b",
    yOffset: "b",
    dateStart: new Date("1900"),
    size: 20,
  },
  {
    name: "c",
    yOffset: "c",
    dateStart: new Date("2000"),
    size: 40,
  },
  {
    name: "a2",
    yOffset: "a",
    dateStart: new Date("2012"),
    size: 60,
  },
];

const width = 700;
const height = 100;
const margin = 40;

export default {
  title: "Charts/Timeline",
  component: Timeline,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Timeline {...defaultArgs}>
          <TimelineGrid
            scale={defaultArgs.xScale}
            height={height}
            margin={margin}
          />
          <Story />
        </Timeline>
      </svg>
    ),
  ],
} as ComponentMeta<typeof Timeline>;

const Template: ComponentStory<typeof EventPoint> = (args) =>
  args.events.map((e) => {
    //TODO: decide what to show here: either Timeline or EventPoint, should make typing easier
    return (
      <EventPoint
        key={nanoid()}
        position={
          new Vector2(
            defaultArgs.xScale(e.dateStart),
            defaultArgs.yScale(e.yOffset)
          )
        }
        radius={e.size}
        fill={"grey"}
      >
        <PointLabel placement={LabelPlacement.TOP}>
          {fDateShort(e.dateStart)}
        </PointLabel>
      </EventPoint>
    );
  });

const defaultArgs = {
  events: events,
  xScale: scaleTime()
    .domain([new Date("1990"), new Date("2022")])
    .range([20, width - 20]),
  yScale: scalePoint()
    .domain(extent(events.map((e) => e.yOffset ?? "")))
    .range([margin, height - margin]),
};

export const defaultTimeline = Template.bind({});
defaultTimeline.args = {
  ...defaultArgs,
  width: width,
  height: height,
};

export const scaledPointTimeline = Template.bind({});
scaledPointTimeline.args = {
  ...defaultArgs,
  events: eventsScaled,
  width: width,
  height: height,
  scaled: true,
};
