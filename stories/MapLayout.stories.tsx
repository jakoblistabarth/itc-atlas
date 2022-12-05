import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MapLayout from "../components/map/layout/MapLayout";
import BaseLayer from "../components/map/BaseLayer";
import MapLayoutBody from "../components/map/layout/MapLayoutBody";
import MapLayoutHeader from "../components/map/layout/MapLayoutHeader";
import { geoBertin1953 } from "d3-geo-projection";
import defaultTheme from "../lib/styles/themes/defaultTheme";
import getCountries from "../lib/data/getCountries";
import themes from "../lib/styles/themes";
import projections, {
  getProjectionNames,
} from "../lib/utilities/getProjections";

const countries = getCountries();

export default {
  title: "Map Elements/Layouts",
  component: MapLayout,
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
} as ComponentMeta<typeof MapLayout>;

const projection = geoBertin1953();
const bounds = {
  width: 600,
  height: 300,
  frame: { top: 10, bottom: 10, left: 10, right: 10 },
};

const Template: ComponentStory<typeof MapLayout> = (args) => {
  return (
    <MapLayout {...args}>
      <MapLayoutHeader
        bounds={args.bounds}
        title={"Map title"}
      ></MapLayoutHeader>
      <MapLayoutBody bounds={args.bounds}>
        <BaseLayer {...args} countries={countries}></BaseLayer>
      </MapLayoutBody>
    </MapLayout>
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