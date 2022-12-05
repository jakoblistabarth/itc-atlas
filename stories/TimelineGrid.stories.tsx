import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import TimelineGrid from "../components/charts/timeline/TimelineGrid";
import { scaleTime } from "d3";

const width = 700;
const height = 100;
const margin = 40;

const timeDomain = [new Date("1950"), new Date("2030")];
const scale = scaleTime()
  .domain(timeDomain)
  .range([0, width - margin]);

export default {
  title: "Charts/Timeline/TimelineGrid",
  component: TimelineGrid,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof TimelineGrid>;

const Template: ComponentStory<typeof TimelineGrid> = (args) => (
  <TimelineGrid {...args} />
);

export const DefaultTimelineGrid = Template.bind({});
DefaultTimelineGrid.args = {
  scale: scale,
  height: height,
  margin: margin,
};
