import { Meta, StoryObj } from "@storybook/react";
import eth from "../../lib/styles/themes/eth";

import LabelPoint from "./";
import { LabelPlacement } from "../../types/LabelPlacement";

import MarkCircle from "../MarkCircle";
import { Vector2 } from "three";
import MapLayout from "../MapLayout";
import { geoMercator } from "d3-geo";

const width = 600;
const height = 300;
const position: Vector2 = new Vector2(width / 2, height / 2);

const meta = {
  title: "Map Elements/Labels/LabelPoint",
  component: LabelPoint,
  args: {
    position: position,
    style: { ...eth.label, fontSize: 10 },
  },
  argTypes: {
    placement: {
      defaultValue: "Top Right",
      options: Object.values(LabelPlacement),
      control: { type: "radio" },
    },
  },
  decorators: [
    (Story) => (
      <MapLayout bounds={{ width, height }} projection={geoMercator()}>
        <Story />
      </MapLayout>
    ),
  ],
  render: ({ children, ...args }) => (
    <>
      <MarkCircle latitude={0} longitude={0} />
      <LabelPoint {...args}>{children}</LabelPoint>
    </>
  ),
} satisfies Meta<typeof LabelPoint>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultLabelPoint: Story = {
  args: {
    children: "Enschede",
  },
};

export const BoldLabel: Story = {
  args: {
    children: (
      <>
        Enschede <tspan fontWeight={"bold"}>(NLD)</tspan>
      </>
    ),
  },
};
