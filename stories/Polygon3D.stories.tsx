import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import getCountries from "../lib/data/getCountries";
import Polygon3D from "../components/map-3d/Polygon3D";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import * as topojson from "topojson-client";
import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";
import { geoRobinson } from "d3-geo-projection";
import { geoPath } from "d3-geo";
import { Color } from "three";

const height = 300;

const svgSquare = `<svg><path d="M -.5 -.5 H .5 V .5 H -.5 L Z"/></svg>`;
const loader = new SVGLoader();
const svgData = loader.parse(svgSquare);
const shapePath = svgData.paths[0];
const squarePath = shapePath.toShapes(true)[0];

const countries = getCountries();
const featureCollection = topojson.feature(
  countries,
  countries.objects.ne_admin_0_countries
) as FeatureCollection<MultiPolygon | Polygon>;
const feature = featureCollection.features[5];
const projection = geoRobinson().fitExtent(
  [
    [-0.5, -0.5],
    [0.5, 0.5],
  ],
  feature
);
const gPath = geoPath(projection);
const featurePath = gPath(feature);

const svgCountry = `<svg><path d="${featurePath}"/><svg>`;
const svgPath = loader.parse(svgCountry);
const countryShapePath = svgPath.paths[0];
const countryPath = countryShapePath.toShapes(true)[0];

export default {
  title: "Map Elements/Symbols/3D/Polygon3D",
  component: Polygon3D,
  argTypes: {
    fillOpacity: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
  },
  args: {},
  decorators: [
    (Story) => {
      return (
        <div style={{ width: "100%", height: `${height}px` }}>
          <Canvas
            orthographic
            camera={{ position: [0, 0, 100], zoom: 100 }}
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
} as ComponentMeta<typeof Polygon3D>;

const Template: ComponentStory<typeof Polygon3D> = (args) => {
  return <Polygon3D {...args} />;
};

const DefaultArgs = {
  color: new Color("orange"),
  fillOpacity: 1,
};

export const Square = Template.bind({});
Square.args = {
  ...DefaultArgs,
  shape: squarePath,
};

export const Country = Template.bind({});
Country.args = {
  ...DefaultArgs,
  color: new Color("blue"),
  shape: countryPath,
};
