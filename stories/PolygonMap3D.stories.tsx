import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta, StoryObj } from "@storybook/react";
import { geoPath } from "d3-geo";
import { geoBertin1953 } from "d3-geo-projection";
import * as topojson from "topojson-client";
import PolygonMap3D from "../components/map-3d/PolygonMap3D";
import getCountries from "../lib/data/getCountries";
import featureCollectionToSVG from "../lib/cartographic/featureCollectionToSVG";

const countries = getCountries("50m");
const fc = topojson.feature(countries, countries.objects.ne_admin_0_countries);

const projection = geoBertin1953().fitExtent(
  [
    [-5, -5],
    [5, 5],
  ],
  { type: "Sphere" }
);
const svg = featureCollectionToSVG(fc, geoPath(projection));

const meta = {
  title: "Map Types/PolygonMap3D",
  component: PolygonMap3D,
  argTypes: {
    svg: { table: { disable: true } },
  },
  args: {
    color: "teal",
    svg: svg,
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
} satisfies Meta<typeof PolygonMap3D>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPolygonMap3D: Story = {};
