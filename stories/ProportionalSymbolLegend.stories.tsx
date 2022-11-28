import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { scaleSqrt } from "d3";

import ProportionalSymbolLegend from "../components/map/ProportionalSymbolLegend";

const width = 600;
const height = 600;

const testData = [
  0.25, 4, 5, 6, 3, 10, 180, 195, 170, 3, 6, 10, 4, 5, 30, 2, 100, 110, 30.8,
  80, 200, 120, 197,
];

export default {
  title: "Map Elements/Legends/ProportionalSymbolLegend",
  argTypes: {
    min: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
  component: ProportionalSymbolLegend,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof ProportionalSymbolLegend>;

const Template: ComponentStory<typeof ProportionalSymbolLegend> = (args) => {
  return (
    <>
      <ProportionalSymbolLegend {...args} />
    </>
  );
};

const defaultArgs = {
  x: 0,
  y: 0,
  data: testData,
  unitLabel: "fruit",
  scaleRadius: scaleSqrt().domain([0, 200]).range([5, 30]),
  title: "Apples per tree",
  showFunction: false,
};

export const simpleLegend = Template.bind({});
simpleLegend.args = {
  ...defaultArgs,
};

export const legendWithDistribution = Template.bind({});
legendWithDistribution.args = {
  ...defaultArgs,
  showFunction: true,
};

export const largeRadius = Template.bind({});
largeRadius.args = {
  ...defaultArgs,
  showFunction: true,
  scaleRadius: scaleSqrt().domain([0, 200]).range([5, 100]),
};
