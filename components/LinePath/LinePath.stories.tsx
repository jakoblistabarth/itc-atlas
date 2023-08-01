import { Meta, StoryObj } from "@storybook/react";

import LinePath from "./";
import { randomInt, range, scaleLinear } from "d3";

const meta = {
  title: "Charts/LinePath",
  component: LinePath,
  args: {
    data: range(2000, 2020).map((d) => ({ x: d, y: randomInt(50)() })),
    xScale: scaleLinear().domain([2000, 2020]).range([0, 100]),
    yScale: scaleLinear().domain([0, 49]).range([30, 0]),
    identifier: "Sample Data",
    isFocus: true,
    isSelected: true,
    isSelection: false,
    mouseEnterLeaveHandler: () => {
      console.log("mouse");
    },
  },
  decorators: [
    (Story) => (
      <svg width={1000} height={500}>
        <g transform={`translate(${100} ${100})`}>
          <Story />
        </g>
      </svg>
    ),
  ],
} satisfies Meta<typeof LinePath>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultLinePath: Story = {};

export const HigherLinePath: Story = {
  args: {
    yScale: scaleLinear().domain([0, 49]).range([75, 0]),
  },
};

export const LongLinePath: Story = {
  args: {
    xScale: scaleLinear().domain([2000, 2020]).range([50, 500]),
  },
};
