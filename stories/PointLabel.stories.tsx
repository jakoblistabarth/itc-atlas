import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import eth from "../lib/styles/themes/eth";

import PointLabel from "../components/map/PointLabel";
import { LabelPlacement } from "../types/LabelPlacement";

import PointSymbol from "../components/map/PointSymbol";
import { Vector2 } from "three";

const width = 600;
const height = 300;
const position: Vector2 = new Vector2(width / 2, height / 2);

export default {
  title: "Cartographic/Labels/PointLabel",
  component: PointLabel,
  argTypes: {
    placement: {
      defaultValue: "Top Right",
      options: [
        "top right",
        "right",
        "bottom right",
        "bottom",
        "bottom left",
        "left",
        "top left",
        "top",
        "center",
      ],
      control: { type: "radio" },
    },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof PointLabel>;

const Template: ComponentStory<typeof PointLabel> = ({
  placement,
  children,
  ...args
}) => (
  <>
    <PointSymbol position={args.position} style={args.style} />
    <PointLabel {...args} placement={getPlacement(placement)}>
      {children}
    </PointLabel>
  </>
);

const getPlacement = (placementInput: string) => {
  const searchStr = placementInput.toUpperCase().replace(" ", "");
  const result = LabelPlacement[searchStr];
  return result;
};

const defaultArgs = {
  position: position,
  children: "Enschede",
  style: eth.label,
};

export const defaultLabel = Template.bind({});
defaultLabel.args = {
  ...defaultArgs,
};

export const boldLabel = Template.bind({});
boldLabel.args = {
  ...defaultArgs,
  children: (
    <>
      Enschede <tspan fontWeight={"bold"}>(NLD)</tspan>
    </>
  ),
};
