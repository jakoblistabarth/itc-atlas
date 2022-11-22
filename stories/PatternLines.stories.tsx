import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PatternLines from "../components/defs/patterns/PatternLines";

const width = 300;
const height = 300;

export default {
  title: "Patterns/PatternLines",
  component: PatternLines,
  argTypes: {
    spacing: { control: { type: "range", min: 0, max: 10, step: 0.01 } },
    angle: { control: { type: "range", min: -90, max: 90, step: 15 } },
    strokeWidth: { control: { type: "range", min: 0.25, max: 10, step: 0.01 } },
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
} as ComponentMeta<typeof PatternLines>;

const Template: ComponentStory<typeof PatternLines> = (args) => {
  return (
    <>
      <PatternLines {...args} />
    </>
  );
};

const defaultArgs = {
  angle: 0,
  name: "pattern",
  fill: "none",
  stroke: "black",
};

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};
export const RotatedColor = Template.bind({});
RotatedColor.args = {
  ...defaultArgs,
  spacing: 2,
  angle: 45,
  stroke: "red",
  strokeWidth: 5,
  strokeOpacity: 0.75,
};
