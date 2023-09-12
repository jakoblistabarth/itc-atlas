import { Meta, StoryObj } from "@storybook/react";
import { geoBertin1953 } from "d3-geo-projection";
import MapLayerBase from ".";
import getCountries from "../../lib/data/getCountries";
import getLakes from "../../lib/data/getLakes";
import getRivers from "../../lib/data/getRivers";
import themes from "../../lib/styles/themes";
import MapLayout from "../MapLayout/MapLayout";

const countries = getCountries();
const countriesDetailed = getCountries("10m");
const lakes = getLakes();
const rivers = getRivers();
const width = 1000;

const meta = {
  title: "Map Layers/MapLayerBase",
  component: MapLayerBase,
  args: {
    countries: countries,
  },
  argTypes: {
    theme: {
      options: Array.from(themes.keys()),
      mapping: Object.fromEntries(themes),
      control: {
        type: "select",
      },
    },
    countries: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <MapLayout bounds={{ width }} projection={geoBertin1953()}>
          <Story />
        </MapLayout>
      );
    },
  ],
} satisfies Meta<typeof MapLayerBase>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMapLayerBase: Story = {};

export const Elaborate: Story = {
  args: {
    lakes: lakes,
    rivers: rivers,
    drawGraticuleLabels: true,
    drawOutline: true,
  },
};

export const Detailed: Story = {
  args: {
    countries: countriesDetailed,
    lakes: lakes,
    rivers: rivers,
    drawOutline: true,
  },
};
