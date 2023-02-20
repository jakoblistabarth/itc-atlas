import { Meta, StoryObj } from "@storybook/react";

import PointSymbol from "../components/map/PointSymbol";
import { Vector2 } from "three";
import themes from "../lib/styles/themes";

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
    style: { fill: "none", stroke: "black" },
    position: new Vector2(width / 2, height / 2),
    radius: 5,
  },
  argTypes: {
    radius: { control: { type: "range", min: 1, max: 50, step: 1 } },
    style: {
      options: Array.from(themes.keys()),
      mapping: styles,
      control: { labels: { bayer: "Bayer", eth: "ETH", raisz: "Raisz" } },
    },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof PointSymbol>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPointSymbol: Story = {};

//TODO: rename or add pattern definition
export const Patternfill: Story = {
  args: {
    style: { fill: "url(#Lines) blue", stroke: "red", opacity: 0.5 },
  },
};
