import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useHelper } from "@react-three/drei";
import getCountries from "../lib/data/getCountries";
import SpaceTimeCube from "../components/map-3d/SpaceTimeCube";
import { SpaceTimeCubeEvent } from "../types/SpaceTimeCubeEvent";
import { Vector2 } from "three";

const events: SpaceTimeCubeEvent[] = [
  {
    dateStart: new Date("1959"),
    name: "Event A in Enschede",
    coordinates: new Vector2(6.895556, 52.223611), //Enschede
    size: 10,
  },
  {
    dateStart: new Date("1970"),
    name: "Event A in Vienna",
    coordinates: new Vector2(16.36666, 48.2), //Vienna
    size: 10,
  },
  {
    dateStart: new Date("1970"),
    name: "Event A in NYC",
    coordinates: new Vector2(-74.005833, 40.712778), //NYC
    size: 10,
  },
  {
    dateStart: new Date("1970"),
    name: "Event A in Vienna",
    coordinates: new Vector2(16.36666, 48.2), //Vienna
    size: 5,
  },
  {
    dateStart: new Date("1986"),
    name: "Event B in Enschede",
    coordinates: new Vector2(6.895556, 52.223611), //Enschede
    size: 20,
  },
  {
    dateStart: new Date("2022"),
    name: "Event A in Vienna",
    coordinates: new Vector2(16.36666, 48.2), //Vienna
    size: 30,
  },
  {
    dateStart: new Date("2022"),
    name: "Event X at the center of the cube",
    coordinates: new Vector2(0, 0),
    size: 35,
  },
];
const countries = getCountries();

export default {
  title: "Map types/SpaceTimeCube",
  component: SpaceTimeCube,
  argTypes: {
    side: {
      control: { type: "range", min: 0.1, max: 1, step: 0.01 },
    },
    height: {
      control: { type: "range", min: 0.01, max: 3, step: 0.01 },
    },
  },
  args: {},
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "100%", height: "500px" }}>
          <Canvas
            style={{ background: "black" }}
            orthographic
            camera={{ position: [0, 0, 100], zoom: 250 }}
            shadows
          >
            <ambientLight args={[undefined, 0.1]} />
            <hemisphereLight
              color="#ffffff"
              groundColor="#080820"
              intensity={1.0}
            />
            <Story />
            <OrbitControls enablePan={false} />
          </Canvas>
        </div>
      );
    },
  ],
} as ComponentMeta<typeof SpaceTimeCube>;

const Template: ComponentStory<typeof SpaceTimeCube> = (args) => {
  return <SpaceTimeCube {...args} />;
};

const DefaultArgs = {
  events,
  geoData: countries,
};

export const Default = Template.bind({});
Default.args = {
  ...DefaultArgs,
};
