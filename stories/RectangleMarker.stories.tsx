import { Meta, StoryObj } from "@storybook/react";
import { Vector4 } from "three";
import RectangleMarker from "../components/map/RectangleMarker";

const side = 300;
const meta = {
  title: "Map Elements/Symbols/RectangleMarker",
  component: RectangleMarker,
  args: {
    bounds: new Vector4(50, side / 2, side / 2, 50),
    fill: "lightgrey",
    stroke: "black",
    strokeWidth: 1,
  },
  argTypes: {},
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof RectangleMarker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultRectangleMarker: Story = {};
export const RedRectangleHighlightMarker: Story = {
  args: {
    fill: "red",
    stroke: "darkred",
    strokeWidth: 1,
  },
};
