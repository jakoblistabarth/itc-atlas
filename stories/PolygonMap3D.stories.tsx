import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Meta, StoryObj } from "@storybook/react";
import { geoPath } from "d3-geo";
import { geoBertin1953 } from "d3-geo-projection";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import * as topojson from "topojson-client";
import PolygonMap3D from "../components/map-3d/PolygonMap3D";
import getCountries from "../lib/data/getCountries";
import simplifyTopology from "../lib/cartographic/simplifyTopology";
import featureCollectionToSVG from "../lib/cartographic/featureCollectionToSVG";

const countries = simplifyTopology(getCountries(), 0.5);
const fc = topojson.feature(
  countries,
  countries.objects.ne_admin_0_countries
) as FeatureCollection<MultiPolygon | Polygon>;

const projection = geoBertin1953().fitExtent(
  [
    [-1, -1],
    [1, 1],
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
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "100%", height: "300px" }}>
          <Canvas
            orthographic
            camera={{ position: [0, 1, 0], zoom: 250 }}
            shadows
          >
            <axesHelper />
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
