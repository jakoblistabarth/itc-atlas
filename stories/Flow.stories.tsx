import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { scaleLinear } from "d3-scale";
import { geoPath } from "d3-geo";
import { geoRobinson } from "d3-geo-projection";
import type { Feature, LineString } from "geojson";

import Flow from "../components/map/Flow";
import ArrowHead from "../components/defs/marker/ArrowHead";

const width = 600;
const height = 300;
const getLineString = (value: number = 10): Feature<LineString> => ({
  type: "Feature",
  properties: { name: "Test", value: value },
  geometry: {
    type: "LineString",
    coordinates: [
      [-90, 0],
      [90, 0],
    ],
  },
});

export default {
  title: "Cartographic/Flow",
  component: Flow,
  argTypes: {
    bend: { control: { type: "range", min: -0.4, max: 0.4, step: 0.01 } },
    projection: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <defs>
          <ArrowHead color="black" />
        </defs>
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
} as ComponentMeta<typeof Flow>;

const Template: ComponentStory<typeof Flow> = (args) => <Flow {...args} />;

const defaultArgs = {
  scale: scaleLinear().domain([0, 100]).range([0, 10]),
  projection: geoRobinson()
    .fitSize([width - 5, height - 5], {
      type: "Sphere",
    })
    .translate([width / 2, height / 2]),
  datum: getLineString(),
  style: { fill: "white", stroke: "black" },
};

export const SmallFlow = Template.bind({});
SmallFlow.args = {
  ...defaultArgs,
};

export const BigFlow = Template.bind({});
BigFlow.args = {
  ...defaultArgs,
  datum: getLineString(100),
};
