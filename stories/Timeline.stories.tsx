import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Timeline from "../components/charts/timeline/Timeline";
import { TimelineEvent } from "../types/TimelineEvent";

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

export default {
  title: "Charts/Timeline",
  component: Timeline,
  decorators: [
    (Story) => (
      <svg width={700} height={100}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof Timeline>;

const Template: ComponentStory<typeof Timeline> = (args) => (
  <Timeline {...args} />
);

const defaultArgs = {
  events: events,
  grid: true,
  position: [0, 0] as [number, number],
};

export const defaultTimeline = Template.bind({});
defaultTimeline.args = {
  ...defaultArgs,
  width: 700,
  height: 100,
};

export const scaledTimeline = Template.bind({});
scaledTimeline.args = {
  ...defaultArgs,
  events: eventsScaled,
  width: 700,
  height: 100,
  scaled: true,
};
