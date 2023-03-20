import { Meta, StoryObj } from "@storybook/react";

import PatternShapes from "../components/defs/patterns/PatternShapes";
import Star from "../components/shapes/Star";
import NsidedPolygon from "../components/shapes/NsidedPolygon";

import { MdWaterDrop } from "react-icons/md";

const width = 300;
const height = 300;

const meta = {
  title: "Patterns/PatternShapes",
  component: PatternShapes,
  args: {
    width: 20,
    height: 20,
    name: "pattern",
    angle: 0,
  },
  argTypes: {
    spacing: { control: { type: "range", min: 0, max: 2, step: 0.01 } },
    name: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
        <rect width={width} height={width} fill="url(#pattern)" />
      </svg>
    ),
  ],
} satisfies Meta<typeof PatternShapes>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Stars: Story = {
  args: {
    children: <Star rays={5} innerRadius={4} outerRadius={10} />,
  },
};

export const Pentagons: Story = {
  args: {
    children: <NsidedPolygon sides={5} radius={10} />,
  },
};

export const IrregularDecorative: Story = {
  args: {
    height: 20,
    width: 10,
    children: (
      <>
        <rect
          transform="translate(-4, -9)"
          width={8}
          height={18}
          rx={5}
          fill={"none"}
          stroke={"lightgrey"}
        />
        <Star rays={6} innerRadius={2} outerRadius={4} fill={"teal"} />
        <Star
          transform="translate(0 -6)"
          rays={4}
          innerRadius={1}
          outerRadius={2}
          fill={"blue"}
        />
        <Star
          transform="translate(0 6)"
          rays={4}
          innerRadius={1}
          outerRadius={2}
          fill={"blue"}
        />
      </>
    ),
  },
};

export const Isotype: Story = {
  args: {
    height: 16,
    width: 16,
    spacing: 0,
    children: <MdWaterDrop color="SkyBlue" x={16 / -2} y={16 / -2} />,
  },
};
