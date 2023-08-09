import { Meta, StoryObj } from "@storybook/react";

import MarkCircle from ".";
import { Vector2 } from "three";
import themes from "../../lib/styles/themes";
import PatternLine from "../PatternLine";

const width = 600;
const height = 300;

const stylesArr = Array.from(themes.entries()).map(([key, value]) => [
  key,
  value.symbol,
]);
const styles = Object.fromEntries(stylesArr);

const meta = {
  title: "Map Elements/Marks/MarkCircle",
  component: MarkCircle,
  args: {
    fill: "transparent",
    stroke: "black",
    position: new Vector2(width / 2, height / 2),
    radius: 5,
  },
  argTypes: {
    radius: { control: { type: "range", min: 1, max: 50, step: 1 } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <defs>
          <PatternLine stroke={"red"} />
        </defs>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof MarkCircle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMarkCircle: Story = {};
export const StaticMarkCircle: Story = {
  args: {
    interactive: false,
  },
};

export const Patternfill: Story = {
  args: {
    fill: "url(#Lines) blue",
    stroke: "red",
    fillOpacity: 1,
    opacity: 1,
  },
};
