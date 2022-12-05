import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import LeaderLine from "../components/LeaderLine";
import { Vector2 } from "three";

const side = 200;

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
      <circle
        cx={args.sourcePos.x}
        cy={args.sourcePos.y}
        r={2}
        fill={"lightgrey"}
      />
      <circle
        cx={args.targetPos.x}
        cy={args.targetPos.y}
        r={6}
        fill={"none"}
        stroke={"lightgrey"}
      />
      <LeaderLine {...args} style={args.style} />
    </>
  );
};

const defaultArgs = {
  sourcePos: new Vector2(side / 2 - 50, side / 2 - 50),
  targetPos: new Vector2(side / 2 + 50, side / 2 + 50),
  angle: Math.PI / 2,
  stroke: "teal",
  strokeWidth: "1",
};

export const verticalLeaderLine = Template.bind({});
verticalLeaderLine.args = {
  ...defaultArgs,
};
export const horizontalLeaderLine = Template.bind({});
horizontalLeaderLine.args = {
  ...defaultArgs,
  sourcePos: new Vector2(side / 2 - 75, side / 2 - 25),
  targetPos: new Vector2(side / 2 + 75, side / 2 + 25),
};
