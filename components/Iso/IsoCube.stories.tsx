import { Meta, StoryObj } from "@storybook/react";

import IsoCube from "./IsoCube";

const width = 300;
const height = 300;

const meta = {
  title: "Shapes/IsoCube",
  component: IsoCube,
  args: {
    xy: [width / 2, height / 2],
    side: 20,
    style: { fill: "white", fillOpacity: 1 },
  },
  argTypes: {
    side: { control: { type: "range", min: 5, max: 50, step: 1 } },
    value: { control: { type: "range", min: 0, max: 100, step: 0.1 } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof IsoCube>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Base2Cube: Story = {
  args: {
    base: 2,
    value: 80,
  },
};

export const Base3Cube: Story = {
  args: {
    base: 3,
    value: 92,
  },
};
