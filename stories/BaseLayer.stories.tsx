import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import BaseLayer from "../components/map/BaseLayer";
import { geoBertin1953, geoInterruptedMollweide } from "d3-geo-projection";
import Map from "../components/map/layout/Map";
import MapBody from "../components/map/layout/MapBody";
import themes from "../lib/styles/themes";

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
      options: ["Bertin", "Interrupted Mollweide"],
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

console.log(Object.keys(themes));

const Template: ComponentStory<typeof BaseLayer> = (
  args,
  { loaded: { countries } }
) => {
  return <BaseLayer {...args} data={countries} />;
};

export const Simple = Template.bind({});
Simple.args = {
  ...Template.args,
  projection: geoBertin1953(),
};

export const Elaborate = Template.bind({});
Elaborate.args = {
  ...Template.args,
  projection: geoBertin1953(),
  drawGraticuleLabels: true,
  drawOutline: true,
};
