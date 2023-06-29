import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Globe from "../components/map-3d/Globe";

import Flow3D from "../components/map-3d/Flow3D";
import GlobeEnvironment from "../components/map-3d/GlobeEnvironment";

const meta = {
  title: "Map Elements/Symbols/Flow3D",
  component: Flow3D,
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
} satisfies Meta<typeof Flow3D>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    origin: [-118.2437, 34.0522],
    destination: [-70.6693, -33.4489],
    data: {
      origin: "Los Angeles",
      destination: "Santiago de Chile",
    },
  },
};

export const LongFlow: Story = {
  args: {
    origin: [0, 90],
    destination: [0, -90],
    arcHeight: 0.5,
    data: {
      origin: "North Pole",
      destination: "South Pole",
    },
  },
};
