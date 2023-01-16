import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import * as topojson from "topojson-client";
import { geoRobinson } from "d3-geo-projection";
import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";

import PolygonSymbol from "../components/map/PolygonSymbol";
import getCountries from "../lib/data/getCountries";
import PatternLines from "../components/defs/patterns/PatternLines";

const width = 600;
const height = 300;

const countries = getCountries();
const featureCollection = topojson.feature(
  countries,
  countries.objects.ne_admin_0_countries
) as FeatureCollection<MultiPolygon | Polygon>;
const feature = featureCollection.features[5];
const projection = geoRobinson().fitSize([width, height], feature);

export default {
  title: "Map Elements/Symbols/PolygonSymbol",
  component: PolygonSymbol,
  argTypes: {
    projection: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <defs>
          <PatternLines stroke="blue" spacing={5} angle={45} />
        </defs>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof PolygonSymbol>;

const Template: ComponentStory<typeof PolygonSymbol> = (args) => {
  return (
    <>
      <PolygonSymbol {...args} feature={feature} projection={projection} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  fill: "lightgrey",
  stroke: "grey",
};

export const Patternfill = Template.bind({});
Patternfill.args = {
  ...Default.args,
  fill: "url(#Lines) blue",
  stroke: "red",
  opacity: 0.5,
};
