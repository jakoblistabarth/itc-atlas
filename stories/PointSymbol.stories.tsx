import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

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

export default {
  title: "Map Elements/Symbols/PointSymbol",
  component: PointSymbol,
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
} as ComponentMeta<typeof PointSymbol>;

const Template: ComponentStory<typeof PointSymbol> = (args) => {
  return (
    <>
      <PointSymbol {...args} style={args.style} />
    </>
  );
};

const defaultArgs = {
  style: { fill: "none", stroke: "black" },
  position: new Vector2(width / 2, height / 2),
  radius: 5,
};

export const SolidFill = Template.bind({});
SolidFill.args = {
  ...defaultArgs,
};

export const Patternfill = Template.bind({});
Patternfill.args = {
  ...defaultArgs,
  style: { fill: "url(#Lines) blue", stroke: "red", opacity: 0.5 },
};
