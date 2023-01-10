import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ScaledPie from "../components/map/ScaledPie";
import { Vector2 } from "three";
import { scaleOrdinal } from "d3";

const width = 600;
const height = 300;

export default {
  title: "Charts/ScaledPie",
  component: ScaledPie,
  argTypes: {
    radius: {
      control: { type: "range", min: 5, max: height / 2, step: 0.01 },
    },
  },
  args: {
    position: new Vector2(width / 2, height / 2),
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof ScaledPie>;

const Template: ComponentStory<typeof ScaledPie> = (args) => (
  <ScaledPie {...args} />
);

export const Default = Template.bind({});
Default.args = {
  radius: 100,
  data: [
    { value: 30, label: "A" },
    { value: 10, label: "B" },
    { value: 2, label: "C" },
  ],
  color: scaleOrdinal<string, string>()
    .domain(["A", "B", "C"])
    .range(["orange", "red", "skyblue"]),
};

export const WithBlackOutline = Template.bind({});
WithBlackOutline.args = {
  ...Default.args,
  style: { stroke: "black", strokeWidth: 2 },
};
