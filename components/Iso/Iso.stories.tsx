import { Meta, StoryObj } from "@storybook/react";
import { scaleLinear } from "d3-scale";

import Iso from ".";

const width = 300;
const height = 300;

const meta = {
  title: "Shapes/Iso",
  component: Iso,
  args: {
    scaleHeight: scaleLinear().domain([0, 100]).range([0, 100]),
    transform: `translate(${width / 2} ${height / 2})`, //Question: proper ts solution?
    style: { fill: "white", stroke: "black" },
  },
  argTypes: {
    side: { control: { type: "range", min: 5, max: 50, step: 1 } },
    value: { control: { type: "range", min: 1, max: 100, step: 1 } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof Iso>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ThinUnit: Story = {
  args: {
    value: 10,
    side: 10,
  },
};

export const BigUnit: Story = {
  args: {
    value: 10,
    side: 50,
  },
};

export const ColoredUnitLabel: Story = {
  args: {
    value: 90,
    side: 10,
    label: true,
    style: { fill: "darksalmon", stroke: "darkmagenta" },
  },
};
