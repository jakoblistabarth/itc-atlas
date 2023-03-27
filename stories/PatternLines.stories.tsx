import { Meta, StoryObj } from "@storybook/react";

import PatternLines from "../components/defs/patterns/PatternLines";

const width = 300;
const height = 300;

const meta = {
  title: "Patterns/PatternLines",
  component: PatternLines,
  args: {
    angle: 0,
    name: "pattern",
    fill: "none",
    stroke: "black",
  },
  argTypes: {
    spacing: { control: { type: "range", min: 0, max: 10, step: 0.01 } },
    name: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
        <rect width={width} height={width} fill="url(#pattern)" />
      </svg>
    ),
  ],
} satisfies Meta<typeof PatternLines>;
export default meta;
type Story = StoryObj<typeof meta>;

export const RotatedColor: Story = {
  args: {
    spacing: 2,
    angle: 45,
    stroke: "red",
    strokeWidth: 5,
    strokeOpacity: 0.75,
  },
};
export const dashed: Story = {
  args: {
    spacing: 2,
    stroke: "black",
    strokeWidth: 5,
    strokeDasharray: "2%",
    strokeDashoffset: "1%",
    strokeOpacity: 0.75,
  },
};
