import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Globe from "../components/map-3d/Globe";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default {
  title: "Cartographic/Globe",
  component: Globe,
  argTypes: {
    texture: {
      control: "select",
      options: ["day", "night", "explorer"],
    },
    bumpScale: {
      control: { type: "range", min: 0, max: 1, step: 0.001 },
    },
    displacementScale: {
      control: { type: "range", min: 0, max: 0.05, step: 0.001 },
    },
  },
  args: {},
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "500px" }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 30 }} shadows>
          <Story />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
        {/* <canvas style={{ display: "none" }} ref={canvasRef} /> */}
      </div>
    ),
  ],
} as ComponentMeta<typeof Globe>;

const Template: ComponentStory<typeof Globe> = (args) => {
  return <Globe {...args} />;
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
