import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Blockdiagram from "../components/map-3d/BlockDiagram";
import * as grossglockner from "../data/topographic/elevation-Grossglockner.json";

const meta = {
  title: "Map Elements/Symbols/Blockdiagram",
  component: Blockdiagram,
  args: {
    name: "uv-grid",
    data: Float32Array.from(grossglockner.elevation),
    segments: Math.sqrt(grossglockner.elevation.length - 1),
    yScale: 0.0001,
    zOffset: 0.25,
    side: 1,
    ratio: 1,
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
        <Canvas camera={{ position: [0, 0, 5], fov: 30 }} shadows>
          <Story />
          <OrbitControls />
          <axesHelper />
          <pointLight position={[5, 10, 0]} />
          <ambientLight intensity={0.25} />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof Blockdiagram>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
