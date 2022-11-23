import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PatternShapes from "../components/defs/patterns/PatternShapes";
import Star from "../components/shapes/Star";
import NsidedPolygon from "../components/shapes/NsidedPolygon";

const width = 300;
const height = 300;

export default {
  title: "Patterns/PatternShapes",
  component: PatternShapes,
  argTypes: {
    size: { control: { type: "range", min: 0, max: 50, step: 1 } },
    angle: { control: { type: "range", min: -90, max: 90, step: 0.1 } },
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
} as ComponentMeta<typeof PatternShapes>;

const Template: ComponentStory<typeof PatternShapes> = (args) => {
  return (
    <>
      <PatternShapes {...args} />
    </>
  );
};

const defaultArgs = {
  size: 20,
  name: "pattern",
  children: <Star rays={5} innerRadius={4} outerRadius={10} />,
};

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};

export const Pentagon = Template.bind({});
Pentagon.args = {
  ...defaultArgs,
  children: <NsidedPolygon sides={5} radius={10} />,
};
