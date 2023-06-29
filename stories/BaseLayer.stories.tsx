import { Meta, StoryObj } from "@storybook/react";
import { geoBertin1953 } from "d3-geo-projection";
import BaseLayer from "../components/map/BaseLayer";
import getCountries from "../lib/data/getCountries";
import getLakes from "../lib/data/getLakes";
import getRivers from "../lib/data/getRivers";
import themes from "../lib/styles/themes";
import projections, { getProjectionNames } from "./lib/getProjections";
import getMapHeight from "../lib/cartographic/getMapHeight";

const countries = getCountries();
const countriesDetailed = getCountries("10m");
const lakes = getLakes();
const rivers = getRivers();
const width = 1000;

const meta = {
  title: "Map Layers/BaseLayer",
  component: BaseLayer,
  args: {
    projection: geoBertin1953(),
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
    projection: {
      options: getProjectionNames(),
      mapping: projections,
      control: {
        type: "select",
      },
    },
  },
  render: (args) => {
    const projection = args.projection ?? geoBertin1953();
    const height = getMapHeight(width, projection);
    return (
      <svg width={width} height={height}>
        <BaseLayer {...{ ...args, projection }} />
      </svg>
    );
  },
} satisfies Meta<typeof BaseLayer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBaseLayer: Story = {};

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
