import { Meta, StoryObj } from "@storybook/react";
import { scaleLinear } from "d3-scale";
import { geoPath } from "d3-geo";
import { geoRobinson } from "d3-geo-projection";
import type { Feature, LineString } from "geojson";

import MarkFlow from ".";
import ArrowHead from "../MarkerArrowHead";
import MapLayout from "../MapLayout";

const width = 600;
const height = 300;
const projection = geoRobinson()
  .fitSize([width - 5, height - 5], {
    type: "Sphere",
  })
  .translate([width / 2, height / 2]);
const getLineString = (value = 10): Feature<LineString> => ({
  type: "Feature",
  properties: { name: "Test", value: value },
  geometry: {
    type: "LineString",
    coordinates: [
      [-90, 0],
      [90, 0],
    ],
  },
});

const meta = {
  title: "Map Elements/Marks/MarkFlow",
  component: MarkFlow,
  argTypes: {
    bend: { control: { type: "range", min: -0.4, max: 0.4, step: 0.01 } },
  },
  args: {
    strokeWidthScale: scaleLinear().domain([0, 100]).range([0, 10]),
    datum: getLineString(),
    fill: "none",
    stroke: "black",
  },
  render: (args) => (
    <>
      <defs>
        <ArrowHead color={args.stroke} shape={"triangle"} />
        <ArrowHead color={args.stroke} shape={"tip"} />
      </defs>
      <MarkFlow {...args} />
    </>
  ),
  decorators: [
    (Story) => (
      <MapLayout bounds={{ width, height }} projection={projection}>
        <path
          d={geoPath(projection)({ type: "Sphere" }) ?? ""}
          stroke={"grey"}
          strokeWidth={"0.5"}
          fill={"none"}
        />
        <Story />
      </MapLayout>
    ),
  ],
} satisfies Meta<typeof MarkFlow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMarkFlow: Story = {};

export const BigMarkFlowWithTriangleHead: Story = {
  args: {
    datum: getLineString(100),
    bend: -0.2,
    fill: "none",
    stroke: "red",
    opacity: 0.5,
    arrowShape: "triangle",
  },
};
