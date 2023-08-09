import { Meta, StoryObj } from "@storybook/react";

import AxisX from ".";
import { scaleLinear } from "d3";

const width = 400;
const height = 100;
const margin = 10;
const innerWidth = width - 2 * margin;

const meta = {
  title: "Charts/AxisX",
  component: AxisX,
  args: {
    xScale: scaleLinear().domain([0, 100]).range([0, innerWidth]),
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <g transform={`translate(${margin} ${margin})`}>
          <Story />
        </g>
      </svg>
    ),
  ],
} satisfies Meta<typeof AxisX>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultAxisX: Story = {};

export const AxisXWithHighValues: Story = {
  args: {
    xScale: scaleLinear().domain([0, 1e6]).range([0, innerWidth]),
  },
};
