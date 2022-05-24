import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { scaleLinear } from "d3-scale";

import IsoBox from "../components/map/IsoBox";

const width = 300;
const height = 300;

export default {
  title: "Cartographic/Symbology/Iso Box",
  component: IsoBox,
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
} as ComponentMeta<typeof IsoBox>;

const Template: ComponentStory<typeof IsoBox> = (args) => <IsoBox {...args} />;

const defaultArgs = {
  scale: scaleLinear().domain([0, 100]).range([0, 100]),
  xy: [width / 2, height / 2],
  style: { fill: "white", stroke: "black" },
};

export const SmallBox = Template.bind({});
SmallBox.args = {
  ...defaultArgs,
  value: 10,
  side: 10,
};

export const BigBox = Template.bind({});
BigBox.args = {
  ...defaultArgs,
  value: 90,
  side: 10,
};
