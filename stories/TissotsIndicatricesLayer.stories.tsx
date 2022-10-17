import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import BaseLayer from "../components/map/BaseLayer";
import {
  geoBertin1953,
  geoInterruptedMollweide,
  geoBaker,
} from "d3-geo-projection";
import { geoMercator } from "d3-geo";
import Map from "../components/map/layout/Map";
import MapBody from "../components/map/layout/MapBody";
import TissotsIndicatricesLayer from "../components/map/TissotsIndicatricesLayer";
import themes from "../lib/styles/themes";
import getCountries from "../lib/data/getCountries";
import projections, {
  getProjectionNames,
} from "../lib/utilities/getProjections";

const countries = getCountries();

export default {
  title: "Cartographic/Layer/TissotsIndicatrices",
  component: TissotsIndicatricesLayer,
  argTypes: {
    opacity: {
      control: {
        type: "range",
        min: 0.1,
        max: 1,
        step: 0.01,
      },
    },
    radius: {
      control: {
        type: "range",
        min: 1,
        max: 5,
        step: 0.1,
      },
    },
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
} as ComponentMeta<typeof TissotsIndicatricesLayer>;

const bounds = { width: 300 };

const Template: ComponentStory<
  typeof TissotsIndicatricesLayer | typeof BaseLayer
> = (args) => {
  return (
    <Map projection={args.projection} bounds={bounds}>
      <MapBody bounds={bounds}>
        <BaseLayer {...args} countries={countries} />
        {/* @ts-expect-error */}
        <TissotsIndicatricesLayer {...args} />
      </MapBody>
    </Map>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  ...Template.args,
  projection: geoBertin1953(),
  drawGraticuleLabels: false,
  strokeColor: "none",
  fillColor: "black",
  opacity: 0.2,
  radius: 2.5,
};

export const Clipped = Template.bind({});
Clipped.args = {
  ...Basic.args,
  radius: 10,
  step: 40,
  projection: geoInterruptedMollweide(),
};

export const Baker = Template.bind({});
Baker.args = {
  ...Basic.args,
  radius: 2.5,
  step: 10,
  fillColor: "red",
  projection: geoBaker(),
};

export const Mercator = Template.bind({});
Mercator.args = {
  ...Basic.args,
  fillColor: "blue",
  opacity: 0.8,
  projection: geoMercator(),
};
