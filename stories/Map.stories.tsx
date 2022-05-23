import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Map from "../components/map/layout/Map";
import BaseLayer from "../components/map/BaseLayer";
import MapBody from "../components/map/layout/MapBody";
import MapHeader from "../components/map/layout/MapHeader";
import { geoBertin1953 } from "d3-geo-projection";
import defaultTheme from "../lib/styles/themes/defaultTheme";

export default {
  title: "Cartographic/Map",
  component: Map,
} as ComponentMeta<typeof Map>;

const projection = geoBertin1953();
const bounds = {
  width: 600,
  height: 300,
  frame: { top: 100, bottom: 10, left: 10, right: 10 },
};

const Template: ComponentStory<typeof Map> = (
  args,
  { loaded: { countries } }
) => {
  return (
    <Map {...args}>
      <MapHeader bounds={args.bounds} title={"Map title"}></MapHeader>
      <MapBody bounds={args.bounds}>
        <BaseLayer projection={projection} data={countries}></BaseLayer>
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

export const BigLeftAside = Template.bind({});
BigLeftAside.args = {
  ...Template.args,
  debug: true,
  theme: defaultTheme,
  projection: projection,
  bounds: { width: 900, frame: { top: 0, left: 100 } },
};
