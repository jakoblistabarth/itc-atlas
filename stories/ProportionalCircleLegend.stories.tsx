import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { scaleSqrt } from "d3";

import ProportionalCircleLegend from "../components/map/ProportionalCircleLegend";

const width = 600;
const height = 600;

const testData = [
  0.25, 4, 5, 6, 3, 10, 180, 195, 170, 3, 6, 10, 4, 5, 30, 2, 100, 110, 30.8,
  80, 200, 120, 197,
];

export default {
  title: "Map Elements/Legends/ProportionalCircleLegend",
  argTypes: {
    min: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
  component: ProportionalCircleLegend,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof ProportionalCircleLegend>;

const Template: ComponentStory<typeof ProportionalCircleLegend> = (args) => {
  return (
    <>
      <ProportionalCircleLegend {...args} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  x: 0,
  y: 0,
  data: testData,
  unitLabel: "fruit",
  scaleRadius: scaleSqrt().domain([0, 200]).range([5, 30]),
  title: "Apples per tree",
  showFunction: false,
};

export const LegendWithDistribution = Template.bind({});
LegendWithDistribution.args = {
  ...Default.args,
  showFunction: true,
};

export const LargeRadius = Template.bind({});
LargeRadius.args = {
  ...Default.args,
  showFunction: true,
  scaleRadius: scaleSqrt().domain([0, 200]).range([5, 100]),
};
