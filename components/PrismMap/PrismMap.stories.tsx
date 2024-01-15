import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta, StoryObj } from "@storybook/react";
import { scaleLinear, scaleOrdinal } from "d3";
import { geoBaker, geoBertin1953 } from "d3-geo-projection";
import { GeoJsonProperties } from "geojson";
import PrismMap from ".";
import getCountries from "../../lib/data/getCountries";
import projections, {
  getProjectionNames,
} from "../../stories/lib/getProjections";
import PrismMapEnvironment from "../PrismMapEnvironment";

const meta = {
  title: "Map Types/PrismMap",
  component: PrismMap,
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
    topology: getCountries(),
    topologyObject: "ne_admin_0_countries",
    projection: geoBertin1953(),
    width: 10,
    length: 10,
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
            camera={{ position: [0, 5, 5], zoom: 75 }}
            shadows
          >
            <axesHelper args={[7.5]} />
            <PrismMapEnvironment />
            <Story />
            <OrbitControls />
          </Canvas>
        </div>
      );
    },
  ],
} satisfies Meta<typeof PrismMap>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPrismMap: Story = {};

export const PrismMapWithExtrusionAndColor: Story = {
  args: {
    projection: geoBaker(),
    colorScale: scaleOrdinal<string, string, string>()
      .domain(["important", "very important"])
      .range(["teal", "orange"])
      .unknown("ligthgrey"),
    colorPropertyAccessor: (properties) => properties?.category,
    extrusionScale: scaleLinear()
      .domain([0, 100])
      .range([0.01, 2])
      .unknown(0.01),
    extrusionPropertyAccessor: (properties) => properties?.value,
    featureProperties: new Map<string, GeoJsonProperties>([
      ["NLD", { category: "important", value: 50 }],
      ["IDN", { category: "very important", value: 100 }],
    ]),
  },
};
