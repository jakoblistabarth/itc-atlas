import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Map from "../components/map/layout/Map";
import BaseLayer from "../components/map/BaseLayer";
import MapBody from "../components/map/layout/MapBody";
import MapHeader from "../components/map/layout/MapHeader";
import { geoBertin1953 } from "d3-geo-projection";
import defaultTheme from "../lib/styles/themes/defaultTheme";
import getCountries from "../lib/data/getCountries";
import themes from "../lib/styles/themes";
import projections, {
  getProjectionNames,
} from "../lib/utilities/getProjections";

const countries = getCountries();

export default {
  title: "Cartographic/Map",
  component: Map,
  argTypes: {
    theme: {
      options: Array.from(themes.keys()),
      mapping: Object.fromEntries(themes),
      control: {
        type: "select",
      },
    },
    projection: {
      options: getProjectionNames(),
      mapping: projections,
      control: {
        type: "select",
      },
    },
  },
} as ComponentMeta<typeof Map>;

const projection = geoBertin1953();
const bounds = {
  width: 600,
  height: 300,
  frame: { top: 10, bottom: 10, left: 10, right: 10 },
};

const Template: ComponentStory<typeof Map> = (args) => {
  return (
    <Map {...args}>
      <MapHeader bounds={args.bounds} title={"Map title"}></MapHeader>
      <MapBody bounds={args.bounds}>
        <BaseLayer {...args} countries={countries}></BaseLayer>
      </MapBody>
    </Map>
  );
};

export const Simple = Template.bind({});
Simple.args = {
  ...Template.args,
  debug: true,
  theme: defaultTheme,
  projection: projection,
  bounds: bounds,
};

export const BigHeader = Template.bind({});
BigHeader.args = {
  ...Template.args,
  debug: true,
  theme: defaultTheme,
  projection: projection,
  bounds: { width: 900, frame: { top: 100, left: 0 } },
};

export const LeftAside = Template.bind({});
LeftAside.args = {
  ...Template.args,
  debug: true,
  theme: defaultTheme,
  projection: projection,
  bounds: { width: 900, frame: { top: 0, left: 100 } },
};
