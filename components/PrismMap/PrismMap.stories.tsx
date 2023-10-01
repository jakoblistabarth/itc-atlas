import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta, StoryObj } from "@storybook/react";
import { geoBertin1953, geoBaker } from "d3-geo-projection";
import PrismMap from ".";
import getCountries from "../../lib/data/getCountries";
import projections, {
  getProjectionNames,
} from "../../stories/lib/getProjections";
import { scaleLinear, scaleOrdinal } from "d3";
import { GeoJsonProperties } from "geojson";

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
            <Environment preset="apartment" />
            <directionalLight
              position={[10, 10, 5]}
              intensity={5}
              castShadow
              shadow-bias={-0.0001}
            />
            <AccumulativeShadows opacity={0.25}>
              <RandomizedLight position={[10, 10, 5]} />
            </AccumulativeShadows>
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
  tags: ["wip"], //TODO: add this tag to sidebar?
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
