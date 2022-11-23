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
    spacing: { control: { type: "range", min: 0, max: 2, step: 0.01 } },
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
  width: 20,
  height: 20,
  name: "pattern",
  children: <Star rays={5} innerRadius={4} outerRadius={10} />,
};

export const Stars = Template.bind({});
Stars.args = {
  ...defaultArgs,
};

export const Pentagons = Template.bind({});
Pentagons.args = {
  ...defaultArgs,
  children: <NsidedPolygon sides={5} radius={10} />,
};

export const IrregularDecorative = Template.bind({});
IrregularDecorative.args = {
  ...defaultArgs,
  height: 20,
  width: 10,
  children: (
    <>
      <rect
        transform="translate(-4, -9)"
        width={8}
        height={18}
        rx={5}
        fill={"none"}
        stroke={"lightgrey"}
      />
      <Star rays={6} innerRadius={2} outerRadius={4} fill={"teal"} />
      <Star
        transform="translate(0 -6)"
        rays={4}
        innerRadius={1}
        outerRadius={2}
        fill={"blue"}
      />
      <Star
        transform="translate(0 6)"
        rays={4}
        innerRadius={1}
        outerRadius={2}
        fill={"blue"}
      />
    </>
  ),
};
