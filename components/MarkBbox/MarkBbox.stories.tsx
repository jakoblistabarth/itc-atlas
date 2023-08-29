import { Meta, StoryObj } from "@storybook/react";
import * as d3 from "d3";
import MarkBbox from ".";
import MapLayout from "../MapLayout";

const rotation: [number, number] = [-150, -20];
const projection = d3.geoOrthographic().rotate(rotation);
const side = 300;
const meta = {
  title: "Map Elements/Marks/MarkBbox",
  component: MarkBbox,
  args: {
    bounds: [120, 34, 134, 24],
  },
  argTypes: {},
  decorators: [
    (Story) => (
      <MapLayout bounds={{ width: side, height: side }} projection={projection}>
        <Story />
      </MapLayout>
    ),
  ],
} satisfies Meta<typeof MarkBbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMarkBbox: Story = {};
export const RedRectangleHighlightMarker: Story = {
  args: {
    fill: "red",
    stroke: "darkred",
  },
};
