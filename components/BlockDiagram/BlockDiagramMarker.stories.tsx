import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";

import BlockdiagramMarker from "./BlockDiagramMarker";

const meta = {
  title: "Map Types/BlockDiagram/BlockdiagramMarker",
  component: BlockdiagramMarker,
  parameters: {
    status: {
      type: "beta",
    },
  },
  args: {
    textureFileName: "sur.jpg",
    latitude: 5,
    longitude: -56,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "500px" }}>
        <Canvas camera={{ position: [0, 3, 3], fov: 30, zoom: 10 }} shadows>
          <OrbitControls />
          <Story />
          <Environment preset="city" />
          <directionalLight position={[1, 2, 3]} />
          <AccumulativeShadows scale={1} opacity={0.5}>
            <RandomizedLight
              amount={10}
              mapSize={64 * 2 ** 8}
              position={[1, 2, 3]}
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
