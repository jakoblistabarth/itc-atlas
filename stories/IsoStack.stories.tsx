import { Meta, StoryObj } from "@storybook/react";

import IsoStack from "../components/map/IsoStack";

const width = 300;
const height = 300;

const meta = {
  title: "Map Elements/Symbols/IsoStack",
  component: IsoStack,
  args: {
    maxUnits: 10,
    xy: [width / 2, height / 2],
    style: { fill: "white", stroke: "black" },
  },
  argTypes: {
    side: { control: { type: "range", min: 5, max: 50, step: 1 } },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof IsoStack>;
export default meta;
type Story = StoryObj<typeof meta>;

export const BigShortStack: Story = {
  args: {
    value: 30,
    side: 30,
  },
};

export const ThinTallStack: Story = {
  args: {
    maxUnits: 20,
    value: 100,
    side: 5,
  },
};

export const ColoredStack: Story = {
  args: {
    maxUnits: 5,
    value: 80,
    side: 20,
    style: { fill: "yellow", stroke: "darkred" },
  },
};
