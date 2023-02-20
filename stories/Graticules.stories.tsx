import { Meta, StoryObj } from "@storybook/react";
import { geoBertin1953 } from "d3-geo-projection";
import Graticules from "../components/map/Graticules";
import MapLayout from "../components/map/layout/MapLayout";
import MapLayoutBody from "../components/map/layout/MapLayoutBody";
import themes from "../lib/styles/themes";
import { Bounds } from "../types/MapOptions";
import projections, { getProjectionNames } from "./lib/getProjections";

const meta = {
  title: "Map Layers/Graticules",
  component: Graticules,
  args: {
    bounds: {
      width: 1000,
    },
    projection: geoBertin1953(),
  },
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
  render: (args) => (
    <MapLayout projection={args.projection} bounds={args.bounds}>
      <MapLayoutBody bounds={args.bounds}>
        <Graticules {...args} />
      </MapLayoutBody>
    </MapLayout>
  ),
} satisfies Meta<React.ComponentProps<typeof Graticules> & { bounds: Bounds }>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultGraticules: Story = {
  args: {
    projection: geoBertin1953(),
  },
};
