import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";

import Blockdiagram from "../components/map-3d/BlockDiagram";
import * as grossglockner from "../data/topographic/elevation-Grossglockner.json";
import BlockDiagramEnvironment from "../components/map-3d/BlockDiagramEnvironment";

const meta = {
  title: "Map Elements/Symbols/Blockdiagram",
  component: Blockdiagram,
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
} satisfies Meta<typeof Blockdiagram>;
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
