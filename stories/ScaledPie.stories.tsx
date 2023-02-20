import { Meta, StoryObj } from "@storybook/react";

import ScaledPie from "../components/map/ScaledPie";
import { Vector2 } from "three";
import { scaleOrdinal } from "d3";

const width = 600;
const height = 300;

const meta = {
  title: "Charts/ScaledPie",
  component: ScaledPie,
  args: {
    radius: 100,
    data: [
      { value: 30, label: "A" },
      { value: 10, label: "B" },
      { value: 2, label: "C" },
    ],
    color: scaleOrdinal<string, string>()
      .domain(["A", "B", "C"])
      .range(["orange", "red", "skyblue"]),
    position: new Vector2(width / 2, height / 2),
  },
  argTypes: {
    radius: {
      control: { type: "range", min: 5, max: height / 2, step: 0.01 },
    },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof ScaledPie>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultScaledPie: Story = {};

export const WithBlackOutline: Story = {
  args: { style: { stroke: "black", strokeWidth: 2 } },
};
