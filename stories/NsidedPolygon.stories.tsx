import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import NsidedPolygon from "../components/shapes/NsidedPolygon";

const side = 300;

export default {
  title: "Shapes/NsidedPolygon",
  component: NsidedPolygon,
  argTypes: {
    sides: { control: { type: "range", min: 3, max: 12, step: 1 } },
    strokeWidth: { control: { type: "range", min: 0.5, max: 10, step: 0.5 } },
    radius: {
      control: { type: "range", min: 2, max: side / 2, step: 0.5 },
    },
  },
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof NsidedPolygon>;

const Template: ComponentStory<typeof NsidedPolygon> = (args) => {
  return (
    <>
      <NsidedPolygon {...args} style={args.style} />
    </>
  );
};

export const DefaultNsidedPolygon = Template.bind({});
DefaultNsidedPolygon.args = {
  radius: side / 4,
  sides: 3,
  transform: `translate(${side / 2} ${side / 2})`,
  fill: "teal",
  fillOpacity: 0.2,
  stroke: "teal",
  strokeWidth: 2,
};
