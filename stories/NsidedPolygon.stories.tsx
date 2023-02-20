import { Meta, StoryObj } from "@storybook/react";
import NsidedPolygon from "../components/shapes/NsidedPolygon";

const side = 300;

const meta = {
  title: "Shapes/NsidedPolygon",
  component: NsidedPolygon,
  argTypes: {
    sides: { control: { type: "range", min: 3, max: 12, step: 1 } },
    strokeWidth: { control: { type: "range", min: 0.5, max: 10, step: 0.5 } },
    radius: {
      control: { type: "range", min: 2, max: side / 2, step: 0.5 },
    },
  },
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof NsidedPolygon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultNsidedPolygon: Story = {
  args: {
    radius: side / 4,
    sides: 3,
    transform: `translate(${side / 2} ${side / 2})`,
    fill: "teal",
    fillOpacity: 0.2,
    stroke: "teal",
    strokeWidth: 2,
  },
};
