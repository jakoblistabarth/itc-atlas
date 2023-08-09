import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta, StoryObj } from "@storybook/react";
import { geoBertin1953, geoBaker } from "d3-geo-projection";
import ExtrudedGeometries from ".";
import getCountries from "../../lib/data/getCountries";
import projections, {
  getProjectionNames,
} from "../../stories/lib/getProjections";

const meta = {
  title: "Map Types/ExtrudedGeometries",
  component: ExtrudedGeometries,
  argTypes: {
    topology: { table: { disable: true } },
    projection: {
      options: getProjectionNames(),
      mapping: projections,
      control: {
        type: "select",
      },
    },
  },
  args: {
    color: "teal",
    topology: getCountries(),
    topologyObject: "ne_admin_0_countries",
    projection: geoBertin1953(),
    width: 10,
    height: 10,
    extrudeGeometryOptions: {
      depth: 0.01,
      bevelSize: 0.005,
      bevelThickness: 0.005,
      bevelSegments: 12,
    },
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "100%", height: "400px" }}>
          <Canvas
            orthographic
            camera={{ position: [0, 50, 0], zoom: 25 }}
            shadows
          >
            <axesHelper args={[7.5]} />
            <ambientLight args={[undefined, 0.1]} />
            <hemisphereLight
              color="#ffffff"
              groundColor="#080820"
              intensity={1.0}
            />
            <Story />
            <OrbitControls />
          </Canvas>
        </div>
      );
    },
  ],
} satisfies Meta<typeof ExtrudedGeometries>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultExtrudedGeometries: Story = {};
export const ExtrudedGeometriesInterrupted: Story = {
  tags: ["wip"], //TODO: add this tag to sidebar?
  args: {
    projection: geoBaker(),
  },
};
