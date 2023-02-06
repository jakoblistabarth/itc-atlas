import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import PointLabel from "../components/map/PointLabel";
import { LabelPlacement } from "../types/LabelPlacement";
import EventPoint from "../components/charts/timeline/EventPoint";
import { TimelineEvent } from "../types/TimelineEvent";
import { DefaultTimelineGrid } from "./TimelineGrid.stories";

const event: TimelineEvent = {
  name: "Event Point",
  yOffset: "a",
  dateStart: new Date("2012"),
  size: 30,
};

const scale = DefaultTimelineGrid.args?.scale;
const margin = DefaultTimelineGrid.args?.margin ?? 0;
const width = scale?.range()[1] ?? 0 + margin;
const height = 100;

const meta: Meta<typeof EventPoint> = {
  title: "Charts/Timeline/EventPoint",
  component: EventPoint,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
  render: (args) => (
    <EventPoint {...args}>
      <PointLabel placement={LabelPlacement.TOP}>{event.name}</PointLabel>
    </EventPoint>
  ),
};
export default meta;
type Story = StoryObj<typeof EventPoint>;

export const DefaultEventPoint: Story = {
  args: {
    y: height / 2 - 20,
    date: event.dateStart,
    xScale: scale,
  },
};

export const ScaledEventPoint: Story = {
  args: {
    ...DefaultEventPoint.args,
    radius: event.size,
    fillOpacity: 0.1,
    stroke: "black",
    drawCenter: true,
  },
};
