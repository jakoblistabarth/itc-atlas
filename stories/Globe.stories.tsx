import React, { useRef } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Globe from "../components/map-3d/Globe";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GlobeTexture from "../components/map-3d/GlobeTexture";
import getCountries from "../lib/data/getCountries";

const countries = getCountries();

const meta = {
  title: "Map types/Globe",
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
      control: { type: "range", min: 0, max: 0.1, step: 0.001 },
    },
  },
  args: {
    neCountriesTopoJson: countries,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "500px" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => {
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
        <GlobeTexture
          ref={canvasRef}
          {...args}
          neCountriesTopoJson={countries}
        />
      </>
    );
  },
} satisfies Meta<
  React.ComponentProps<typeof Globe> & React.ComponentProps<typeof GlobeTexture>
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultGlobe: Story = {
  args: {
    texture: "day",
  },
};

export const NightGlobe: Story = {
  args: {
    texture: "night",
  },
};

export const ExplorerGlobe: Story = {
  args: {
    texture: "explorer",
  },
};

export const CanvasTextureGlobe: Story = {
  args: {
    canvasTexture: true,
  },
};

export const HoloTextureGlobe: Story = {
  args: {
    canvasTexture: true,
    transparent: true,
    fillColor: "rgba(0,200,255,0.3)",
    strokeColor: "lightblue",
    graticuleColor: "rgba(0,200,255,0.1)",
    sphereColor: "rgba(255,255,255,0.1)",
  },
};
