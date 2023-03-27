import { Meta, StoryObj } from "@storybook/react";

import Star from "../components/shapes/Star";

const side = 300;

const meta = {
  title: "Shapes/Star",
  component: Star,
  argTypes: {
    rays: { control: { type: "range", min: 3, max: 36, step: 1 } },
    innerRadius: {
      control: { type: "range", min: 0, max: side / 2, step: 0.5 },
    },
    outerRadius: {
      control: { type: "range", min: 10, max: side / 2, step: 0.5 },
    },
  },
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof Star>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultStar: Story = {
  args: {
    innerRadius: side / 6,
    outerRadius: side / 3,
    transform: `translate(${side / 2} ${side / 2})`,
    fill: "teal",
    fillOpacity: 0.2,
    stroke: "teal",
    strokeWidth: 2,
  },
};
