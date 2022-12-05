import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
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

export default {
  title: "Charts/Timeline/EventPeriod",
  component: EventPeriod,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof EventPeriod>;

const Template: ComponentStory<typeof EventPeriod> = (args) => (
  <EventPeriod {...args}>
    <PointLabel placement={LabelPlacement.LEFT}>{event.name}</PointLabel>
  </EventPeriod>
);

export const DefaultEventPeriod = Template.bind({});
DefaultEventPeriod.args = {
  yOffset: height / 2,
  dateStart: event.dateStart,
  dateEnd: event.dateEnd,
  xScale: scale,
};

export const StyledEventPeriod = Template.bind({});
StyledEventPeriod.args = {
  ...DefaultEventPeriod.args,
  fillOpacity: 0.1,
  stroke: "green",
};
