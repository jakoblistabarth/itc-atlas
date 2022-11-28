import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import NominalLegend from "../components/map/NominalLegend";
import Star from "../components/shapes/Star";
import NsidedPolygon from "../components/shapes/NsidedPolygon";

const width = 600;
const height = 600;

export default {
  title: "Map Elements/Legends/NominalLegend",
  argTypes: {},
  component: NominalLegend,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof NominalLegend>;

const Template: ComponentStory<typeof NominalLegend> = (args) => {
  return (
    <>
      <NominalLegend {...args} />
    </>
  );
};

const defaultArgs = {
  x: 0,
  y: 0,
  entries: [
    { label: "VVD", color: "orange" },
    { label: "PvdA", color: "red" },
    { label: "CDA", color: "purple" },
    { label: "D66", color: "skyblue" },
  ],
  title: "Parties",
};

export const simpleLegend = Template.bind({});
simpleLegend.args = {
  ...defaultArgs,
};

export const multicolummnLegend = Template.bind({});
multicolummnLegend.args = {
  ...defaultArgs,
  columns: 4,
  columnWidth: 30,
};

export const customSymbol = Template.bind({});
customSymbol.args = {
  ...defaultArgs,
  entries: [
    {
      label: "VVD",
      color: "yellow",
      symbol: <Star innerRadius={2} outerRadius={5} />,
    },
    {
      label: "PvdA",
      color: "orange",
      symbol: <NsidedPolygon sides={3} radius={5.5} />,
    },
    {
      label: "CDA",
      color: "red",
      symbol: <NsidedPolygon sides={4} radius={5} transform="rotate(45)" />,
    },
    {
      label: "D66",
      color: "skyblue",
      symbol: <NsidedPolygon sides={4} radius={5} />,
    },
  ],
};
