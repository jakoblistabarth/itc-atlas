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
  title: "Map Elements/Labels/PointLabel",
  component: PointLabel,
  argTypes: {
    placement: {
      defaultValue: "Top Right",
      options: Object.values(LabelPlacement),
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

const Template: ComponentStory<typeof PointLabel> = ({ children, ...args }) => (
  <>
    <PointSymbol position={args.position ?? new Vector2(0, 0)} />
    <PointLabel {...args}>{children}</PointLabel>
  </>
);

export const DefaultPointLabel = Template.bind({});
DefaultPointLabel.args = {
  position: position,
  children: "Enschede",
  style: { ...eth.label, fontSize: 10 },
};

export const BoldLabel = Template.bind({});
BoldLabel.args = {
  ...DefaultPointLabel.args,
  children: (
    <>
      Enschede <tspan fontWeight={"bold"}>(NLD)</tspan>
    </>
  ),
};
