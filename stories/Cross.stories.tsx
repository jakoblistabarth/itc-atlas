import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Cross from "../components/shapes/Cross";
import { Vector2 } from "three";
import themes from "../lib/styles/themes";

const width = 600;
const height = 300;

const stylesArr = Array.from(themes.entries()).map(([key, value]) => [
  key,
  value.symbol,
]);
const styles = Object.fromEntries(stylesArr);

export default {
  title: "Shapes/Cross",
  component: Cross,
  argTypes: {
    length: { control: { type: "range", min: 1, max: 50, step: 1 } },
    style: {
      options: Array.from(themes.keys()),
      mapping: styles,
    },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof Cross>;

const Template: ComponentStory<typeof Cross> = (args) => {
  return (
    <>
      <Cross {...args} style={args.style} />
    </>
  );
};

const defaultArgs = {
  style: { fill: "none", stroke: "black" },
  position: new Vector2(width / 2, height / 2),
};

export const DefaultCross = Template.bind({});
DefaultCross.args = {
  ...defaultArgs,
};

export const HeavyCross = Template.bind({});
HeavyCross.args = {
  ...defaultArgs,
  length: 15,
  style: { stroke: "black", strokeWidth: 10 },
};

export const HeavyCrossWithHalo = Template.bind({});
HeavyCrossWithHalo.args = {
  ...defaultArgs,
  length: 15,
  style: { stroke: "black", strokeWidth: 10 },
  halos: [
    {
      size: 1.5,
      color: "white",
    },
    { size: 2, color: "black" },
  ],
};
