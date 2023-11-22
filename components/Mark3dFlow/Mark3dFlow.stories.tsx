import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Globe from "../Globe";

import Mark3dFlow from "./";
import GlobeEnvironment from "../Globe/GlobeEnvironment";

const meta = {
  title: "Map Elements/Marks3d/Mark3dFlow",
  component: Mark3dFlow,
  args: {
    value: 30,
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 0.01 },
    },
    arcHeight: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "500px" }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 30 }} shadows>
          <Globe texture="explorer" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
          />
          <GlobeEnvironment />
          <Story />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof Mark3dFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    origin: { position: [-118.2437, 34.0522], airport: "Los Angeles" },
    destination: {
      position: [-70.6693, -33.4489],
      airport: "Santiago de Chile",
    },
    data: {
      origin: "Los Angeles",
      destination: "Santiago de Chile",
    },
  },
};

export const LongFlow: Story = {
  args: {
    origin: { position: [0, 90], airport: "North Pole" },
    destination: { position: [0, -90], airport: "South Pole" },
    arcHeight: 0.5,
    data: {
      origin: "North Pole",
      destination: "South Pole",
    },
  },
};
