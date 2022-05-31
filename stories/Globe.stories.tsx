import React, { useRef } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Globe from "../components/map-3d/Globe";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GlobeTexture from "../components/map-3d/GlobeTexture";

export default {
  title: "Cartographic/Globe",
  component: Globe,
  argTypes: {
    canvasRef: { table: { disable: true } },
    canvasTexture: { table: { disable: true } },
    texture: {
      control: "select",
      options: ["day", "night", "explorer"],
    },
    radius: {
      control: { type: "range", min: 0.25, max: 1.5, step: 0.01 },
    },
    bumpScale: {
      control: { type: "range", min: 0, max: 0.5, step: 0.001 },
    },
    displacementScale: {
      control: { type: "range", min: 0, max: 0.05, step: 0.001 },
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
} as ComponentMeta<typeof Globe>;

const Template: ComponentStory<typeof Globe> = (
  args,
  { loaded: { countries } }
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <>
      <Canvas camera={{ position: [0, 0, 5], fov: 30 }} shadows>
        <Globe canvasRef={canvasRef} {...args} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <GlobeTexture ref={canvasRef} countries={countries} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...Template.args,
  texture: "day",
};

export const Night = Template.bind({});
Night.args = {
  ...Template.args,
  texture: "night",
};

export const Explorer = Template.bind({});
Explorer.args = {
  ...Template.args,
  texture: "explorer",
};

export const CanvasTexture = Template.bind({});
CanvasTexture.args = {
  ...Template.args,
  canvasTexture: true,
};
