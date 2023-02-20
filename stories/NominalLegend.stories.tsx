import { Meta, StoryObj } from "@storybook/react";

import NominalLegend from "../components/map/NominalLegend";
import Star from "../components/shapes/Star";
import NsidedPolygon from "../components/shapes/NsidedPolygon";

const width = 600;
const height = 600;

const meta = {
  title: "Map Elements/Legends/NominalLegend",
  args: {
    entries: [
      { label: "VVD", color: "orange" },
      { label: "PvdA", color: "red" },
      { label: "CDA", color: "purple" },
      { label: "D66", color: "skyblue" },
    ],
    title: "Parties",
  },
  component: NominalLegend,
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof NominalLegend>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultNominalLegend: Story = {};

export const MulticolummnLegend: Story = {
  args: {
    columns: 4,
    columnWidth: 30,
  },
};

export const CustomSymbol: Story = {
  args: {
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
  },
};
