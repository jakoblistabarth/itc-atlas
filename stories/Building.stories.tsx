import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Building, { ITCLocationName } from "../components/Building";
import { Vector2 } from "three";

const width = 300;
const height = width / 2;

export default {
  title: "Shapes/Building",
  component: Building,
  argTypes: {},
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof Building>;

const Template: ComponentStory<typeof Building> = (args) => {
  return (
    <>
      <Building {...args} />
    </>
  );
};

const defaultArgs = {
  location: ITCLocationName.DELFT1,
  position: new Vector2(width / 2, height / 2),
};

export const defaultBuilding = Template.bind({});
defaultBuilding.args = {
  ...defaultArgs,
};
