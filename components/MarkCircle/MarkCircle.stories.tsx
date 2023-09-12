import { Meta, StoryObj } from "@storybook/react";

import { geoRobinson } from "d3-geo-projection";
import MarkCircle from ".";
import MapLayout from "../MapLayout/MapLayout";
import PatternLine from "../PatternLine";

const width = 600;
const height = 300;

const meta = {
  title: "Map Elements/Marks/MarkCircle",
  component: MarkCircle,
  args: {
    fill: "transparent",
    stroke: "black",
    latitude: 0,
    longitude: 0,
    radius: 5,
  },
  argTypes: {
    radius: { control: { type: "range", min: 1, max: 50, step: 1 } },
  },
  decorators: [
    (Story) => (
      <MapLayout bounds={{ width, height }} projection={geoRobinson()}>
        <defs>
          <PatternLine stroke={"red"} />
        </defs>
        <Story />
      </MapLayout>
    ),
  ],
} satisfies Meta<typeof MarkCircle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMarkCircle: Story = {};
export const StaticMarkCircle: Story = {
  args: {
    interactive: false,
  },
};

export const Patternfill: Story = {
  args: {
    fill: "url(#Lines) blue",
    stroke: "red",
    fillOpacity: 1,
    opacity: 1,
  },
};
