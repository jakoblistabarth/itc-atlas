import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";

import Book from ".";
import {
  AccumulativeShadows,
  Center,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";

const meta = {
  title: "Shapes/Book",
  component: Book,
  args: {
    color: "red",
  },
  parameters: {
    controls: {
      include: ["color"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "500px" }}>
        <Canvas
          shadows
          orthographic
          camera={{ zoom: 500, position: [3, 3, -3] }}
        >
          <OrbitControls makeDefault />
          <Environment preset="apartment" />
          <group position={[0, 0.02, 0]}>
            <Story />
          </group>
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof Book>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
