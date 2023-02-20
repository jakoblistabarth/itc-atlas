import { Meta, StoryObj } from "@storybook/react";

import LeaderLine from "../components/LeaderLine";
import { Vector2 } from "three";

const side = 200;

const meta = {
  title: "Annotations/LeaderLine",
  component: LeaderLine,
  args: {
    sourcePos: new Vector2(side / 2 - 50, side / 2 - 50),
    targetPos: new Vector2(side / 2 + 50, side / 2 + 50),
    stroke: "teal",
    strokeWidth: "1",
  },
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
  render: (args) => (
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
  ),
} satisfies Meta<typeof LeaderLine>;
export default meta;
type Story = StoryObj<typeof meta>;

export const VerticalLeaderLine: Story = {};

export const HorizontalLeaderLine: Story = {
  args: {
    sourcePos: new Vector2(side / 2 - 75, side / 2 - 25),
    targetPos: new Vector2(side / 2 + 75, side / 2 + 25),
  },
};
