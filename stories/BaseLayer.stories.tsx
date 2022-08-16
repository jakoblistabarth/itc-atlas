import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import BaseLayer from "../components/map/BaseLayer";
import { geoBertin1953, geoInterruptedMollweide } from "d3-geo-projection";
import Map from "../components/map/layout/Map";
import MapBody from "../components/map/layout/MapBody";
import themes from "../lib/styles/themes";
import getCountries from "../lib/data/getCountries";
import getLakes from "../lib/data/getLakes";
import getRivers from "../lib/data/getRivers";

const countries = getCountries();
const lakes = getLakes();
const rivers = getRivers();

export default {
  title: "Cartographic/Layer/BaseLayer",
  component: BaseLayer,
  argTypes: {
    theme: {
      options: Object.keys(themes),
      mapping: Object.values(themes),
      control: {
        type: "select",
      },
    },
    projection: {
      options: ["Bertin", "Interrupted Mollweide"], //TODO: fix projections in args menu
      mapping: [geoBertin1953, geoInterruptedMollweide],
      control: {
        type: "select",
      },
    },
  },
  decorators: [
    (Story) => (
      <Map projection={defaultArgs.projection} bounds={defaultArgs.bounds}>
        <MapBody bounds={defaultArgs.bounds}>
          <Story />
        </MapBody>
      </Map>
    ),
  ],
} as ComponentMeta<typeof BaseLayer>;

const defaultArgs = {
  bounds: {
    width: 1000,
  },
  projection: geoBertin1953(),
};

const Template: ComponentStory<typeof BaseLayer> = (args) => {
  return <BaseLayer {...args} />;
};

export const Simple = Template.bind({});
Simple.args = {
  ...Template.args,
  projection: geoBertin1953(),
  countries: countries,
};

export const Elaborate = Template.bind({});
Elaborate.args = {
  ...Simple.args,
  lakes: lakes,
  rivers: rivers,
  drawGraticuleLabels: true,
  drawOutline: true,
};
