import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import getCountries from "../../lib/data/getCountries";
import SpaceTimeCube from ".";
import { SpaceTimeCubeEvent } from "../../types/SpaceTimeCubeEvent";
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

const meta = {
  title: "Map types/SpaceTimeCube",
  component: SpaceTimeCube,
  parameters: {
    status: {
      type: "beta",
    },
  },
  argTypes: {
    side: {
      control: { type: "range", min: 0.1, max: 10, step: 0.1 },
    },
    height: {
      control: { type: "range", min: 0.01, max: 10, step: 0.1 },
    },
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "100%", height: "500px" }}>
          <Canvas
            style={{ background: "white" }}
            orthographic
            camera={{ position: [0, 0, 100], zoom: 30 }}
            shadows
          >
            <ambientLight args={[undefined, 2]} />
            <directionalLight
              position={[0, 5, 3]}
              args={["white", 3]}
              castShadow
            />
            <Story />
            <OrbitControls enablePan={false} />
          </Canvas>
        </div>
      );
    },
  ],
} satisfies Meta<typeof SpaceTimeCube>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultSpaceTimeCube: Story = {
  args: {
    events,
    topology: countries,
    topologyObject: "ne_admin_0_countries",
  },
};
