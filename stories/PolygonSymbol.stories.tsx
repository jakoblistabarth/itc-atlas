import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import * as topojson from "topojson-client";
import { geoRobinson } from "d3-geo-projection";
import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";
import type { NeCountriesTopoJson } from "../types/NeTopoJson";

import PolygonSymbol from "../components/map/PolygonSymbol";
import getCountries from "../lib/data/getCountries";

const countries = getCountries();
const width = 600;
const height = 300;

export default {
  title: "Cartographic/Symbology/PolygonSymbol",
  component: PolygonSymbol,
  argTypes: {
    projection: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof PolygonSymbol>;

const Template: ComponentStory<typeof PolygonSymbol> = (args) => {
  const countriesTyped = countries as NeCountriesTopoJson; // TODO: fix this typing
  const featureCollection = topojson.feature(
    countriesTyped,
    countriesTyped.objects.ne_admin_0_countries
  ) as FeatureCollection<MultiPolygon | Polygon>;
  const feature = featureCollection.features[5];
  const projection = geoRobinson().fitSize([width, height], feature);
  return (
    <>
      <PolygonSymbol {...args} feature={feature} projection={projection} />
    </>
  );
};

const defaultArgs = {
  style: { fill: "none", stroke: "black" },
};

export const SolidFill = Template.bind({});
SolidFill.args = {
  ...defaultArgs,
};

export const Patternfill = Template.bind({});
Patternfill.args = {
  ...defaultArgs,
  style: { fill: "url(#Lines) blue", stroke: "red", opacity: 0.5 },
};
