import { Meta, StoryObj } from "@storybook/react";

import PointSymbol from "../components/map/PointSymbol";
import { Vector2 } from "three";
import themes from "../lib/styles/themes";
import PatternLines from "../components/defs/patterns/PatternLines";

const width = 600;
const height = 300;

const stylesArr = Array.from(themes.entries()).map(([key, value]) => [
  key,
  value.symbol,
]);
const styles = Object.fromEntries(stylesArr);

const meta = {
  title: "Map Elements/Symbols/PointSymbol",
  component: PointSymbol,
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
          <PatternLines stroke={"red"} />
        </defs>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof PointSymbol>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPointSymbol: Story = {};
export const StaticPointSymbol: Story = {
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
