import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import {
  AccumulativeShadows,
  Backdrop,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";

import BlockdiagramMarker from "../components/map-3d/BlockDiagramMarker";

const meta = {
  title: "Map Elements/Symbols/BlockdiagramMarker",
  component: BlockdiagramMarker,
  args: {
    textureFileName: "sur.jpg",
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
          <hemisphereLight intensity={0.5} />
          <pointLight position={[1, 0.5, -3]} />
          <AccumulativeShadows scale={4}>
            <RandomizedLight
              amount={10}
              mapSize={64 * 2 ** 6}
              position={[1, 2, -3]}
              radius={1}
            />
          </AccumulativeShadows>
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof BlockdiagramMarker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBlockDiagramMarker: Story = {};
