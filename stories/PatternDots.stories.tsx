import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PatternDots from "../components/defs/patterns/PatternDots";

const width = 300;
const height = 300;

export default {
  title: "Patterns/PatternDots",
  component: PatternDots,
  argTypes: {
    dotSize: { control: { type: "range", min: 1, max: 20, step: 1 } },
    spacing: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
    angle: { control: { type: "range", min: -90, max: 90, step: 0.1 } },
    strokeWidth: { control: { type: "range", min: 0, max: 10, step: 0.1 } },
    name: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
        <rect width={width} height={width} fill="url(#pattern)" />
      </svg>
    ),
  ],
} as ComponentMeta<typeof PatternDots>;

const Template: ComponentStory<typeof PatternDots> = (args) => {
  return (
    <>
      <PatternDots {...args} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  angle: 0,
  name: "pattern",
};
export const RotatedMulticolor = Template.bind({});
RotatedMulticolor.args = {
  ...Default.args,
  angle: 45,
  dotSize: 15,
  spacing: 0.5,
  stroke: "red",
  fill: "orange",
  fillOpacity: 0.9,
  strokeWidth: 5,
  strokeOpacity: 0.75,
};
