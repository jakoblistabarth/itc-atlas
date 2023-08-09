import { Meta, StoryObj } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import getCountries from "../../lib/data/getCountries";
import Mark3dGeometry from ".";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import * as topojson from "topojson-client";
import { geoRobinson } from "d3-geo-projection";
import { geoPath } from "d3-geo";
import { Shape } from "three";

const height = 300;

const svgToShapes = (svg: string): Shape[][] => {
  const loader = new SVGLoader();
  const svgData = loader.parse(svg);
  return svgData.paths.map((path) => path.toShapes(true));
};

const countries = getCountries("10m");
const featureCollection = topojson.feature(
  countries,
  countries.objects.ne_admin_0_countries
);
const feature = featureCollection.features.find(
  (d) => d.properties.ADM0_A3 === "GRC"
);
const projection = geoRobinson().fitExtent(
  [
    [-5, -5],
    [5, 5],
  ],
  feature
);
const gPath = geoPath(projection);
const featurePath = gPath(feature ?? featureCollection.features[0]);
const svgCountry = `<path d="${featurePath}" />`;

const meta = {
  title: "Map Elements/Marks3D/Mark3dGeometry",
  component: Mark3dGeometry,
  args: {
    color: "red",
    fillOpacity: 1,
    extrudeGeometryOptions: {
      depth: 0.25,
      bevelSegments: 12,
    },
  },
  argTypes: {
    color: { control: { type: "color" } },
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "100%", height: `${height}px` }}>
          <Canvas
            orthographic
            camera={{ position: [0, 0, 50], zoom: 25 }}
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
            <OrbitControls enablePan={false} />
          </Canvas>
        </div>
      );
    },
  ],
} satisfies Meta<typeof Mark3dGeometry>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Square: Story = {
  args: {
    shape: svgToShapes(`<path d="M -5 -5 H 5 V 5 H -5 L Z" />`)[0],
  },
};

export const Triangle: Story = {
  args: {
    shape: svgToShapes(`<path d="M -5 -5 L 5 -5 L 0 5 Z" />`)[0],
    color: "orange",
  },
};

export const LetterF: Story = {
  args: {
    shape: svgToShapes(
      `<path d="M -5 5 L -5 -5 L 5 -5 L 5 -2 L -1 -2 L -1 0 L 1 0 L 1 3 L -1 3 L -1 5 Z" />`
    )[0],
    color: "pink",
  },
};

export const Country: Story = {
  args: {
    shape: svgToShapes(svgCountry)[0],
    color: "lightblue",
    extrudeGeometryOptions: {
      depth: 0.1,
      bevelThickness: 0.1,
      bevelSize: 0.0075,
      bevelSegments: 6,
    },
  },
};
