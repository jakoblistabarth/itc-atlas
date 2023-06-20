import { Meta, StoryObj } from "@storybook/react";
import * as d3 from "d3";
import RectangleMarker from "../components/map/RectangleMarker";

const rotation: [number, number] = [-150, -20];
const projection = d3.geoOrthographic().rotate(rotation);
const side = 500;
const meta = {
  title: "Map Elements/Symbols/RectangleMarker",
  component: RectangleMarker,
  args: {
    bounds: [120, 34, 134, 24],
    projection: projection,
  },
  argTypes: {},
  decorators: [
    (Story) => (
      <svg width={side} height={side}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof RectangleMarker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultRectangleMarker: Story = {};
export const RedRectangleHighlightMarker: Story = {
  args: {
    fill: "red",
    stroke: "darkred",
  },
};
