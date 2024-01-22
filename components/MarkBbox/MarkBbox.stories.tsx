import { Meta, StoryObj } from "@storybook/react";
import MarkBbox from ".";
import MapLayout from "../MapLayout";
import MapLayerBase from "../MapLayerBase";
import getCountries from "../../lib/data/getCountries";
import { geoBertin1953 } from "d3-geo-projection";

const countries = getCountries();
const projection = geoBertin1953();
const side = 500;
const meta = {
  title: "Map Elements/Marks/MarkBbox",
  component: MarkBbox,
  args: {
    bounds: [8.75, 46.27, 17.34, 49.11],
  },
  argTypes: {},
  decorators: [
    (Story) => (
      <MapLayout bounds={{ width: side, height: side }} projection={projection}>
        <MapLayerBase countries={countries} />
        <Story />
      </MapLayout>
    ),
  ],
} satisfies Meta<typeof MarkBbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMarkBbox: Story = {};
export const Q1: Story = {
  args: {
    bounds: [0, 0, 30, 30],
  },
};
export const Q2: Story = {
  args: {
    bounds: [-30, -30, 0, 0],
  },
};
export const C: Story = {
  args: {
    bounds: [-30, -30, 30, 30],
  },
};
export const RedRectangleHighlightMarker: Story = {
  args: {
    fill: "red",
    stroke: "darkred",
  },
};
