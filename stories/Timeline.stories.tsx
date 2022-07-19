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

export default {
  title: "Charts/Timeline",
  component: Timeline,
  decorators: [
    (Story) => (
      <svg width={700} height={800}>
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
  yDimension: "title",
};

export const defaultTimeline = Template.bind({});
defaultTimeline.args = {
  ...defaultArgs,
  width: 700,
  height: 100,
};
