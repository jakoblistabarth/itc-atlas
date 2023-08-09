import { Meta, StoryObj } from "@storybook/react";
import { scaleSqrt } from "d3";

import LegendProportionalCircle from ".";

const width = 600;
const height = 600;

const testData = [
  0.25, 4, 5, 6, 3, 10, 180, 195, 170, 3, 6, 10, 4, 5, 30, 2, 100, 110, 30.8,
  80, 200, 120, 197,
];

const meta = {
  title: "Map Elements/Legends/LegendProportionalCircle",
  args: {
    x: 0,
    y: 0,
    data: testData,
    unitLabel: "fruit",
    scaleRadius: scaleSqrt().domain([0, 200]).range([5, 30]),
    title: "Apples per tree",
    showFunction: false,
  },
  component: LegendProportionalCircle,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof LegendProportionalCircle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LegendWithDistribution: Story = {
  args: {
    showFunction: true,
  },
};

export const LargeRadius: Story = {
  args: {
    showFunction: true,
    scaleRadius: scaleSqrt().domain([0, 200]).range([5, 100]),
  },
};
