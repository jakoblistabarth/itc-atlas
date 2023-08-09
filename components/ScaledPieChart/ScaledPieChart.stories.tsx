import { Meta, StoryObj } from "@storybook/react";

import ScaledPieChart from ".";
import { Vector2 } from "three";
import { scaleOrdinal } from "d3";

const width = 600;
const height = 300;

const meta = {
  title: "Charts/ScaledPieChart",
  component: ScaledPieChart,
  args: {
    radius: 100,
    data: [
      { value: 30, label: "A" },
      { value: 10, label: "B" },
      { value: 2, label: "C" },
    ],
    colorScale: scaleOrdinal<string, string>()
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
} satisfies Meta<typeof ScaledPieChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultScaledPieChart: Story = {};

export const WithBlackOutline: Story = {
  args: { stroke: "black", strokeWidth: 2 },
};
