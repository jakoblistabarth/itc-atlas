import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Wave from "../components/shapes/Wave";

const side = 300;

export default {
  title: "Shapes/Wave",
  component: Wave,
  argTypes: {
    height: {
      control: { type: "range", min: 0, max: side / 2, step: 0.5 },
    },
    amplitude: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
    },
  },
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof Wave>;

const Template: ComponentStory<typeof Wave> = (args) => {
  return (
    <>
      <Wave {...args} style={args.style} />
    </>
  );
};

const defaultArgs = {
  width: side,
  height: side / 2,
  transform: `translate(0 ${side / 2})`,
  fill: "none",
  stroke: "teal",
  strokeWidth: 2,
};

export const defaultWave = Template.bind({});
defaultWave.args = {
  ...defaultArgs,
};
