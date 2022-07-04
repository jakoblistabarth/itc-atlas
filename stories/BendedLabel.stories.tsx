import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { geoPath } from "d3-geo";
import { geoRobinson, geoBertin1953 } from "d3-geo-projection";
import eth from "../lib/styles/themes/eth";

import BendedLabel from "../components/map/BendedLabel";

const width = 600;
const height = 300;

export default {
  title: "Cartographic/Labels/BendedLabel",
  component: BendedLabel,
  argTypes: {
    degree: { control: { type: "range", min: -180, max: 180, step: 10 } },
    textOriginDegree: {
      control: { type: "range", min: -180, max: 180, step: 10 },
    },
    projection: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <path
          d={geoPath(defaultArgs.projection)({ type: "Sphere" }) ?? ""}
          stroke={"grey"}
          strokeWidth={"0.5"}
          fill={"none"}
        />
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof BendedLabel>;

const Template: ComponentStory<typeof BendedLabel> = (args) => (
  <BendedLabel {...args}>{args.children}</BendedLabel>
);

const defaultArgs = {
  children: "Label Text",
  graticuleType: "lon" as "lon", // QUESTION: improve typing
  degree: 10,
  xOffset: 0,
  yOffset: 10,
  projection: geoRobinson()
    .fitSize([width - 5, height - 5], {
      type: "Sphere",
    })
    .translate([width / 2, height / 2]),
  style: eth.label,
};

export const LonBendedLabel = Template.bind({});
LonBendedLabel.args = {
  ...defaultArgs,
};

export const LatBendedLabel = Template.bind({});
LatBendedLabel.args = {
  ...defaultArgs,
  graticuleType: "lat",
};
