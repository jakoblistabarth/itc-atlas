import { Meta, StoryObj } from "@storybook/react";
import { Vector2 } from "three";

import MarkGlyph from ".";

const side = 300;

const meta = {
  title: "Map Elements/Marks/MarkGlyph",
  component: MarkGlyph,
  args: {
    position: new Vector2(side / 2, side / 2),
    label: "A",
    fill: "lightgrey",
  },
  argTypes: {},
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof MarkGlyph>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMarkGlyph: Story = {};
export const RedHighlightMarker: Story = {
  args: {
    fill: "red",
    stroke: "darkred",
    strokeWidth: 1,
    labelColor: "white",
  },
};
