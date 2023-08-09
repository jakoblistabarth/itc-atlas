import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";

import BlockDiagram from ".";
import * as grossglockner from "../../data/topographic/elevation-Grossglockner.json";
import * as malta from "../../data/topographic/elevation-Malta.json";
import * as paramaribo from "../../data/topographic/elevation-Paramaribo.json";
import BlockDiagramEnvironment from "./BlockDiagramEnvironment";

const meta = {
  title: "Map Types/BlockDiagram/BlockDiagram",
  component: BlockDiagram,
  args: {
    textureFileName: "uv-grid.png",
    side: 1,
    ratio: 1,
    zOffset: 0.1,
  },
  argTypes: {
    data: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "500px" }}>
        <Canvas shadows>
          <Story />
          <axesHelper />
          <BlockDiagramEnvironment />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof BlockDiagram>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    data: Float32Array.from([
      1, 1, 1, 1, 1, 2, 2, 3, 2, 2, 3, 3, 3, 5, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5,
    ]).reverse(),
    yScale: 0.1,
  },
};

export const Grossglockner: Story = {
  args: {
    data: Float32Array.from(grossglockner.elevation),
    ratio: grossglockner.dimensions.ratio,
    yScale: 0.00005,
    textureFileName: "grossglockner.png",
    sideColor: "#cab091",
  },
};

export const Paramaribo: Story = {
  args: {
    data: Float32Array.from(paramaribo.elevation),
    ratio: paramaribo.dimensions.ratio,
    yScale: 0.001,
    textureFileName: "paramaribo.png",
  },
};

export const Malta: Story = {
  args: {
    data: Float32Array.from(malta.elevation),
    ratio: malta.dimensions.ratio,
    yScale: 0.0001,
    textureFileName: "uv-grid.png",
    sideColor: "#3689a5",
  },
};
