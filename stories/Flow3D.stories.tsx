import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Globe from "../components/map-3d/Globe";

import Flow3D from "../components/map-3d/Flow3D";

export default {
  title: "Cartographic/3D/Flow",
  component: Flow3D,
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 0.01 },
    },
    arcHeight: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
    },
  },
  args: {},
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "500px" }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Flow3D>;

const Template: ComponentStory<typeof Flow3D> = (args) => {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 5], fov: 30 }} shadows>
        <Flow3D {...args} />
        <Globe texture="explorer" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...Template.args,
  origin: [-118.2437, 34.0522],
  destination: [-70.6693, -33.4489],
  value: 30,
  data: {
    origin: "Los Angeles",
    destination: "Santiago de Chile",
    value: 30,
  },
};

export const LongFlow = Template.bind({});
LongFlow.args = {
  ...Template.args,
  origin: [0, 90],
  destination: [0, -90],
  value: 30,
  arcHeight: 0.5,
  data: {
    origin: "North Pole",
    destination: "South Pole",
    value: 50,
  },
};