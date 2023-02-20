import { Meta, StoryObj } from "@storybook/react";
import { geoBertin1953 } from "d3-geo-projection";
import BaseLayer from "../components/map/BaseLayer";
import MapLayout from "../components/map/layout/MapLayout";
import MapLayoutBody from "../components/map/layout/MapLayoutBody";
import getCountries from "../lib/data/getCountries";
import getLakes from "../lib/data/getLakes";
import getRivers from "../lib/data/getRivers";
import themes from "../lib/styles/themes";
import projections, { getProjectionNames } from "./lib/getProjections";

const countries = getCountries();
const lakes = getLakes();
const rivers = getRivers();
const defaultArgs = {
  bounds: {
    width: 1000,
  },
  projection: geoBertin1953(),
};

const meta = {
  title: "Map Layers/BaseLayer",
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
      <MapLayout
        projection={defaultArgs.projection}
        bounds={defaultArgs.bounds}
      >
        <MapLayoutBody bounds={defaultArgs.bounds}>
          <Story />
        </MapLayoutBody>
      </MapLayout>
    ),
  ],
} satisfies Meta<typeof BaseLayer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBaseLayer: Story = {
  args: {
    projection: geoBertin1953(),
    countries: countries,
  },
};

export const Elaborate: Story = {
  args: {
    ...DefaultBaseLayer.args,
    lakes: lakes,
    rivers: rivers,
    drawGraticuleLabels: true,
    drawOutline: true,
  },
};
