import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { Backdrop, OrbitControls } from "@react-three/drei";

import BlockdiagramMarker from "../components/map-3d/BlockDiagramMarker";

const meta = {
  title: "Map Elements/Symbols/BlockdiagramMarker",
  component: BlockdiagramMarker,
  args: {
    name: "sur",
    latitude: 5,
    longitude: -56,
    yScale: 0.01,
    zOffset: 0,
    bBox: [0, 0, 0, 0],
    ratio: 1,
    side: 1,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "500px" }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 30, zoom: 10 }} shadows>
          <OrbitControls />
          <Story />
          <ambientLight intensity={0.5} />
          <pointLight
            position={[40, 20, 0]}
            shadow-mapSize={1028 * 8}
            intensity={2}
            castShadow
          />
          <Backdrop
            position={[0, 0, -1]}
            scale={[2, 2, 2]}
            receiveShadow
            floor={0.5} // Stretches the floor segment, 0.25 by default
            segments={20} // Mesh-resolution, 20 by default
          >
            <meshStandardMaterial color="white" />
          </Backdrop>
          <axesHelper />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof BlockdiagramMarker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBlockDiagramMarker: Story = {};
