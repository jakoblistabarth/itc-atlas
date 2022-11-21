import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Star from "../components/shapes/Star";

const side = 300;

export default {
  title: "Shapes/Star",
  component: Star,
  argTypes: {
    rays: { control: { type: "range", min: 3, max: 36, step: 1 } },
    strokeWidth: { control: { type: "range", min: 0.5, max: 10, step: 0.5 } },
    innerRadius: {
      control: { type: "range", min: 0, max: side / 2, step: 0.5 },
    },
    outerRadius: {
      control: { type: "range", min: 10, max: side / 2, step: 0.5 },
    },
  },
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof Star>;

const Template: ComponentStory<typeof Star> = (args) => {
  return (
    <>
      <Star {...args} style={args.style} />
    </>
  );
};

const defaultArgs = {
  transform: `translate(${side / 2} ${side / 2})`,
  fill: "teal",
  fillOpacity: 0.2,
  stroke: "teal",
  strokeWidth: 2,
};

export const defaultStar = Template.bind({});
defaultStar.args = {
  ...defaultArgs,
};
