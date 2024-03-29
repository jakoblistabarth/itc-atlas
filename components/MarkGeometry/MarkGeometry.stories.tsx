import { Meta, StoryObj } from "@storybook/react";
import * as topojson from "topojson-client";
import { geoRobinson } from "d3-geo-projection";

import MarkGeometry from ".";
import getCountries from "../../lib/data/getCountries";
import PatternLine from "../PatternLine";
import MapLayout from "../MapLayout/MapLayout";
import MapLayerBase from "../MapLayerBase/MapLayerBase";

const width = 600;
const height = 300;

const countries = getCountries("10m");
const featureCollection = topojson.feature(
  countries,
  countries.objects.ne_admin_0_countries
);
const feature = featureCollection.features.find(
  (d) => d.properties.ADM0_A3 === "GRC"
);
const projection = geoRobinson();

const meta = {
  title: "Map Elements/Marks/MarkGeometry",
  component: MarkGeometry,
  args: {
    feature,
  },
  decorators: [
    (Story) => (
      <MapLayout
        projection={projection}
        bounds={{ width, height }}
        extent={feature}
      >
        <defs>
          <PatternLine stroke="blue" spacing={5} angle={45} />
        </defs>
        <MapLayerBase countries={countries} />
        <Story />
      </MapLayout>
    ),
  ],
} satisfies Meta<typeof MarkGeometry>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fill: "lightgrey",
    stroke: "grey",
  },
};

export const Patternfill: Story = {
  args: {
    fill: "url(#Lines) blue",
    stroke: "red",
    opacity: 0.5,
  },
};
