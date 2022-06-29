import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import IsoStack from "../components/map/IsoStack";

const width = 300;
const height = 300;

export default {
  title: "Cartographic/Symbology/IsoStack",
  component: IsoStack,
  argTypes: {
    side: { control: { type: "range", min: 5, max: 50, step: 1 } },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof IsoStack>;

const Template: ComponentStory<typeof IsoStack> = (args) => (
  <IsoStack {...args} />
);

const defaultArgs = {
  maxUnits: 10,
  xy: [width / 2, height / 2],
  style: { fill: "white", stroke: "black" },
};

export const BigShortStack = Template.bind({});
BigShortStack.args = {
  ...defaultArgs,
  value: 30,
  side: 30,
};

export const ThinTallStack = Template.bind({});
ThinTallStack.args = {
  ...defaultArgs,
  maxUnits: 20,
  value: 100,
  side: 5,
};

export const ColoredStack = Template.bind({});
ColoredStack.args = {
  ...defaultArgs,
  maxUnits: 5,
  value: 80,
  side: 20,
  style: { fill: "yellow", stroke: "darkred" },
};