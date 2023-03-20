import { Meta, StoryObj } from "@storybook/react";

import Wave from "../components/shapes/Wave";

const side = 300;

const meta = {
  title: "Shapes/Wave",
  component: Wave,
  args: {
    width: side,
    height: side / 2,
    transform: `translate(0 ${side / 2})`,
    fill: "none",
    stroke: "teal",
    strokeWidth: 2,
  },
  argTypes: {
    height: {
      control: { type: "range", min: 0, max: side / 2, step: 0.5 },
    },
    frequency: {
      control: { type: "range", min: 1, max: 50, step: 1 },
    },
    amplitude: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
    },
  },
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof Wave>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultWave: Story = {};
