import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import BlockDiagramSide from "../components/map-3d/BlockDiagramSide";

const meta = {
  title: "Map Elements/Symbols/BlockdiagramSide",
  component: BlockDiagramSide,
  args: {
    yScale: 0.1,
    zOffset: 1,
    heightValues: [0, 1, 2, 3, 4, 5, 6, 5, 3, 2, 5, 6, 4, 2, 0],
    length: 2,
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
} satisfies Meta<typeof BlockDiagramSide>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
