import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import LeaderLine from "../components/LeaderLine";
import { Vector2 } from "three";

const side = 300;

export default {
  title: "Annotations/LeaderLine",
  component: LeaderLine,
  argTypes: {},
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof LeaderLine>;

const Template: ComponentStory<typeof LeaderLine> = (args) => {
  return (
    <>
      <LeaderLine {...args} style={args.style} />
    </>
  );
};

const defaultArgs = {
  sourcePos: new Vector2(side / 2 - 10, side / 2 - 10),
  targetPos: new Vector2(side / 2 + 10, side / 2 + 10),
  stroke: "teal",
  strokeWidth: "1",
};

export const defaultLeaderLine = Template.bind({});
defaultLeaderLine.args = {
  ...defaultArgs,
};
