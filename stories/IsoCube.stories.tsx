import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import IsoCube from "../components/map/IsoCube";

const width = 300;
const height = 300;

export default {
  title: "Cartographic/Symbology/IsoCube",
  component: IsoCube,
  argTypes: {
    side: { control: { type: "range", min: 5, max: 50, step: 1 } },
    value: { control: { type: "range", min: 0, max: 100, step: 0.1 } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof IsoCube>;

const Template: ComponentStory<typeof IsoCube> = (args) => (
  <IsoCube {...args} />
);

const defaultArgs = {
  xy: [width / 2, height / 2],
  side: 20,
  style: { fill: "white", fillOpacity: 1 },
};

export const Base2Cube = Template.bind({});
Base2Cube.args = {
  ...defaultArgs,
  base: 2,
  value: 80,
};

export const Base3Cube = Template.bind({});
Base3Cube.args = {
  ...defaultArgs,
  base: 3,
  value: 92,
};
