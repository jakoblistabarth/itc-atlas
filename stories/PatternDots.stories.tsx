import { Meta, StoryObj } from "@storybook/react";

import PatternDots from "../components/defs/patterns/PatternDots";

const width = 300;
const height = 300;

const meta = {
  title: "Patterns/PatternDots",
  component: PatternDots,
  args: {
    angle: 0,
    name: "pattern",
  },
  argTypes: {
    dotSize: { control: { type: "range", min: 1, max: 20, step: 1 } },
    spacing: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
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
} satisfies Meta<typeof PatternDots>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RotatedDuotone: Story = {
  args: {
    angle: 45,
    dotSize: 15,
    spacing: 0.5,
    stroke: "red",
    fill: "orange",
    fillOpacity: 0.9,
    strokeWidth: 5,
    strokeOpacity: 0.75,
  },
};
