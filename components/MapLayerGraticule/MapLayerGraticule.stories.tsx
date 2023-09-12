import { Meta, StoryObj } from "@storybook/react";
import { geoBertin1953 } from "d3-geo-projection";
import MapLayerGraticule from ".";
import MapLayout from "../MapLayout";
import MapLayoutBody from "../MapLayout/MapLayoutBody";
import themes from "../../lib/styles/themes";
import { Bounds } from "../../types/MapOptions";
import projections, {
  getProjectionNames,
} from "../../stories/lib/getProjections";
import { GeoProjection } from "d3-geo";

const meta = {
  title: "Map Layers/MapLayerGraticule",
  component: MapLayerGraticule,
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
        <MapLayerGraticule {...args} />
      </MapLayoutBody>
    </MapLayout>
  ),
} satisfies Meta<
  React.ComponentProps<typeof MapLayerGraticule> & {
    bounds: Bounds;
    projection: GeoProjection;
  }
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMapLayerGraticule: Story = {
  args: {
    projection: geoBertin1953(),
  },
};
