import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { max, scaleLinear } from "d3";

import ProportionalRectangleLegend from "../components/map/ProportionalRectangleLegend";

const width = 600;
const height = 600;

const data = [
  0.25, 4, 5, 6, 3, 10, 180, 195, 170, 3, 6, 10, 4, 5, 30, 2, 100, 110, 30.8,
  80, 200, 120, 197,
];

export default {
  title: "Map Elements/Legends/ProportionalRectangleLegend",
  argTypes: {
    min: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
  component: ProportionalRectangleLegend,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof ProportionalRectangleLegend>;

const Template: ComponentStory<typeof ProportionalRectangleLegend> = (args) => {
  return (
    <>
      <ProportionalRectangleLegend {...args} />
    </>
  );
};

const defaultArgs = {
  x: 0,
  y: 0,
  data: data,
  entryUnit: "fruit",
  scaleHeight: scaleLinear()
    .domain([0, max(data) ?? 1])
    .range([0, 50]),
  title: "Apples per tree",
};

export const simpleLegend = Template.bind({});
simpleLegend.args = {
  ...defaultArgs,
};

export const stretchedLegend = Template.bind({});
stretchedLegend.args = {
  ...defaultArgs,
  scaleHeight: scaleLinear()
    .domain([0, max(data) ?? 1])
    .range([0, 200]),
};
