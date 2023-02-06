import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import PointLabel from "../components/map/PointLabel";
import { LabelPlacement } from "../types/LabelPlacement";
import EventPeriod from "../components/charts/timeline/EventPeriod";
import { TimelineEvent } from "../types/TimelineEvent";
import { DefaultTimelineGrid } from "./TimelineGrid.stories";

const event: TimelineEvent = {
  name: "Event Period",
  yOffset: "a",
  dateStart: new Date("2012"),
  dateEnd: new Date("2022"),
};

const scale = DefaultTimelineGrid.args?.scale;
const margin = DefaultTimelineGrid.args?.margin ?? 0;
const width = scale?.range()[1] ?? 0 + margin;
const height = 100;

const meta: Meta<typeof EventPeriod> = {
  title: "Charts/Timeline/EventPeriod",
  component: EventPeriod,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
  render: (args) => (
    <EventPeriod {...args}>
      <PointLabel placement={LabelPlacement.LEFT}>{event.name}</PointLabel>
    </EventPeriod>
  ),
};
export default meta;
type Story = StoryObj<typeof EventPeriod>;

export const DefaultEventPeriod: Story = {
  args: {
    yOffset: height / 2,
    dateStart: event.dateStart,
    dateEnd: event.dateEnd,
    xScale: scale,
  },
};

export const StyledEventPeriod: Story = {
  args: {
    ...DefaultEventPeriod.args,
    fillOpacity: 0.1,
    stroke: "teal",
  },
};
