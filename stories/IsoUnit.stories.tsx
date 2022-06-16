import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { scaleLinear } from "d3-scale";

import IsoUnit from "../components/map/IsoUnit";

const width = 300;
const height = 300;

export default {
  title: "Cartographic/Symbology/IsoUnit",
  component: IsoUnit,
  argTypes: {
    side: { control: { type: "range", min: 5, max: 50, step: 1 } },
    value: { control: { type: "range", min: 1, max: 100, step: 1 } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof IsoUnit>;

const Template: ComponentStory<typeof IsoUnit> = (args) => (
  <IsoUnit {...args} />
);

const defaultArgs = {
  scale: scaleLinear().domain([0, 100]).range([0, 100]),
  xy: [width / 2, height / 2],
  style: { fill: "white", stroke: "black" },
};

export const ThinUnit = Template.bind({});
ThinUnit.args = {
  ...defaultArgs,
  value: 10,
  side: 10,
};

export const BigUnit = Template.bind({});
BigUnit.args = {
  ...defaultArgs,
  value: 10,
  side: 50,
};

export const ColoredUnitLabel = Template.bind({});
ColoredUnitLabel.args = {
  ...defaultArgs,
  value: 90,
  side: 10,
  label: true,
  style: { fill: "darksalmon", stroke: "darkmagenta" },
};
