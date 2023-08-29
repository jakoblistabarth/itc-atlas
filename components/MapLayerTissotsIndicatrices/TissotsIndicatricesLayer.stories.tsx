import { Meta, StoryObj } from "@storybook/react";
import MapLayerBase from "../MapLayerBase";
import {
  geoBertin1953,
  geoInterruptedMollweide,
  geoBaker,
} from "d3-geo-projection";
import { GeoProjection, geoMercator } from "d3-geo";
import MapLayout from "../MapLayout";
import MapLayoutBody from "../MapLayout/MapLayoutBody";
import MapLayerTissotsIndicatrices from ".";
import themes from "../../lib/styles/themes";
import getCountries from "../../lib/data/getCountries";
import projections, {
  getProjectionNames,
} from "../../stories/lib/getProjections";
import { MapTheme } from "../../types/MapTheme";

const countries = getCountries();
const bounds = { width: 300, height: 150 };

const meta = {
  title: "Map Layers/MapLayerTissotsIndicatrices",
  component: MapLayerTissotsIndicatrices,
  decorators: [
    (Story) => (
      <svg width={bounds.width} height={bounds.height}>
        <Story />
      </svg>
    ),
  ],
  args: {
    projection: geoBertin1953(),
    strokeColor: "none",
    fillColor: "black",
    opacity: 0.2,
    radius: 2.5,
  },
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
  render: (args) => (
    <MapLayout projection={args.projection} bounds={bounds}>
      <MapLayoutBody bounds={bounds}>
        <MapLayerBase theme={args.theme} countries={countries} />
        <MapLayerTissotsIndicatrices {...args} />
      </MapLayoutBody>
    </MapLayout>
  ),
} satisfies Meta<
  React.ComponentProps<typeof MapLayerTissotsIndicatrices> & {
    theme?: MapTheme;
    projection: GeoProjection;
  }
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Clipped: Story = {
  args: {
    radius: 10,
    step: 40,
    projection: geoInterruptedMollweide(),
  },
};

export const Baker: Story = {
  args: {
    radius: 2.5,
    step: 10,
    fillColor: "red",
    projection: geoBaker(),
  },
};

export const Mercator: Story = {
  args: {
    fillColor: "blue",
    opacity: 0.8,
    projection: geoMercator(),
  },
};
