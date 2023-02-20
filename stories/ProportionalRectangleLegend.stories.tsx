import { Meta, StoryObj } from "@storybook/react";
import { max, scaleLinear } from "d3";

import ProportionalRectangleLegend from "../components/map/ProportionalRectangleLegend";

const width = 600;
const height = 600;

const data = [
  0.25, 4, 5, 6, 3, 10, 180, 195, 170, 3, 6, 10, 4, 5, 30, 2, 100, 110, 30.8,
  80, 200, 120, 197,
];

const meta = {
  title: "Map Elements/Legends/ProportionalRectangleLegend",
  args: {
    x: 0,
    y: 0,
    data: data,
    entryUnit: "fruit",
    scaleHeight: scaleLinear()
      .domain([0, max(data) ?? 1])
      .range([0, 50]),
    title: "Apples per tree",
  },
  component: ProportionalRectangleLegend,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof ProportionalRectangleLegend>;
export default meta;
type Story = StoryObj<typeof meta>;

export const StretchedLegend: Story = {
  args: {
    scaleHeight: scaleLinear()
      .domain([0, max(data) ?? 1])
      .range([0, 200]),
  },
};
