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

export default {
  title: "Cartographic/Layer/TissotsIndicatrices",
  component: TissotsIndicatricesLayer,
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
} as ComponentMeta<typeof TissotsIndicatricesLayer>;

const bounds = { width: 300 };

const Template: ComponentStory<
  typeof TissotsIndicatricesLayer | typeof BaseLayer
> = (args, { loaded: { countries } }) => {
  return (
    <Map projection={args.projection} bounds={bounds}>
      <MapBody bounds={bounds}>
        <BaseLayer {...args} data={countries} />;
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
