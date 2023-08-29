import { Meta, StoryObj } from "@storybook/react";

import MarkScaledPieChart from ".";
import { geoMercator, scaleOrdinal } from "d3";
import MapLayout from "../MapLayout";

const width = 600;
const height = 300;

const meta = {
  title: "Map Elements/Marks/MarkScaledPieChart",
  component: MarkScaledPieChart,
  args: {
    lat: 0,
    lng: 0,
    radius: 50,
    data: [
      { value: 30, label: "A" },
      { value: 10, label: "B" },
      { value: 2, label: "C" },
    ],
    colorScale: scaleOrdinal<string, string>()
      .domain(["A", "B", "C"])
      .range(["orange", "red", "skyblue"]),
  },
  argTypes: {
    radius: {
      control: { type: "range", min: 5, max: height / 2, step: 0.01 },
    },
  },
  decorators: [
    (Story) => (
      <MapLayout bounds={{ width, height }} projection={geoMercator()}>
        <Story />
      </MapLayout>
    ),
  ],
} satisfies Meta<typeof MarkScaledPieChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultScaledPieChart: Story = {};

export const WithBlackOutline: Story = {
  args: { stroke: "black", strokeWidth: 2 },
};
