import { Meta, StoryObj } from "@storybook/react";

import AxisY from ".";
import { format, scaleLinear } from "d3";

const width = 200;
const height = 300;
const margin = 30;
const innerWidth = height - 2 * margin;

const meta = {
  title: "Charts/AxisY",
  component: AxisY,
  args: {
    yScale: scaleLinear().domain([0, 100]).range([innerWidth, 0]),
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
} satisfies Meta<typeof AxisY>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultAxisY: Story = {};

export const AxisYWithHighValues: Story = {
  args: {
    yScale: scaleLinear().domain([0, 1e6]).range([innerWidth, 0]),
    tickFormat: format("~s"),
  },
};
