import { ComponentMeta, ComponentStory } from "@storybook/react";
import { geoBertin1953 } from "d3-geo-projection";
import BaseLayer from "../components/map/BaseLayer";
import Map from "../components/map/layout/Map";
import MapBody from "../components/map/layout/MapBody";
import getCountries from "../lib/data/getCountries";
import getLakes from "../lib/data/getLakes";
import getRivers from "../lib/data/getRivers";
import themes from "../lib/styles/themes";
import projections, {
  getProjectionNames,
} from "../lib/utilities/getProjections";

const countries = getCountries();
const lakes = getLakes();
const rivers = getRivers();

export default {
  title: "Cartographic/BaseLayer",
  component: BaseLayer,
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
