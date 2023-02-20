import { Meta, StoryObj } from "@storybook/react";
import eth from "../lib/styles/themes/eth";

import PointLabel from "../components/map/PointLabel";
import { LabelPlacement } from "../types/LabelPlacement";

import PointSymbol from "../components/map/PointSymbol";
import { Vector2 } from "three";

const width = 600;
const height = 300;
const position: Vector2 = new Vector2(width / 2, height / 2);

const meta = {
  title: "Map Elements/Labels/PointLabel",
  component: PointLabel,
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
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
  render: ({ children, ...args }) => (
    <>
      <PointSymbol position={args.position ?? new Vector2(0, 0)} />
      <PointLabel {...args}>{children}</PointLabel>
    </>
  ),
} satisfies Meta<typeof PointLabel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPointLabel: Story = {
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
