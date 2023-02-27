import { Meta, StoryObj } from "@storybook/react";
import BaseLayer from "../components/map/BaseLayer";
import {
  geoBertin1953,
  geoInterruptedMollweide,
  geoBaker,
} from "d3-geo-projection";
import { geoMercator } from "d3-geo";
import MapLayout from "../components/map/layout/MapLayout";
import MapLayoutBody from "../components/map/layout/MapLayoutBody";
import TissotsIndicatricesLayer from "../components/map/TissotsIndicatricesLayer";
import themes from "../lib/styles/themes";
import getCountries from "../lib/data/getCountries";
import projections, { getProjectionNames } from "./lib/getProjections";
import { MapTheme } from "../types/MapTheme";

const countries = getCountries();
const bounds = { width: 300, height: 150 };

const meta = {
  title: "Map Layers/TissotsIndicatrices",
  component: TissotsIndicatricesLayer,
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
        <BaseLayer
          projection={args.projection}
          theme={args.theme}
          countries={countries}
        />
        <TissotsIndicatricesLayer {...args} />
      </MapLayoutBody>
    </MapLayout>
  ),
} satisfies Meta<
  React.ComponentProps<typeof TissotsIndicatricesLayer> & { theme?: MapTheme }
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
