import { Meta, StoryObj } from "@storybook/react";

import LegendFlow from ".";
import { scaleLinear } from "d3";
import MarkerArrowHead, { ArrowHeadShape } from "../MarkerArrowHead";

const width = 600;
const height = 600;

const meta = {
  title: "Map Elements/Legends/LegendFlow",
  args: {
    unitLabel: "flights",
    data: [10, 50, 100],
    scaleWidth: scaleLinear().domain([0, 100]).range([0, 30]),
    title: "Flights in 2020",
    flowStyle: { arrowShape: "tapered" },
  },
  component: LegendFlow,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        {["tapered", "triangle", "tip"].map((d) => (
          <MarkerArrowHead key={d} shape={d as ArrowHeadShape} />
        ))}
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof LegendFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
