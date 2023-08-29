import { Meta, StoryObj } from "@storybook/react";

import MarkGlyph from ".";
import MapLayout from "../MapLayout";
import { geoMercator } from "d3-geo";

const side = 300;

const meta = {
  title: "Map Elements/Marks/MarkGlyph",
  component: MarkGlyph,
  args: {
    lng: 0,
    lat: 0,
    label: "A",
    fill: "lightgrey",
  },
  argTypes: {},
  decorators: [
    (Story) => (
      <MapLayout bounds={{ width: side }} projection={geoMercator()}>
        <Story />
      </MapLayout>
    ),
  ],
} satisfies Meta<typeof MarkGlyph>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMarkGlyph: Story = {};
export const RedHighlightMarker: Story = {
  args: {
    fill: "red",
    stroke: "darkred",
    strokeWidth: 1,
    labelColor: "white",
  },
};
