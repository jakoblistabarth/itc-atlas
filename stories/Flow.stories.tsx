import { Meta, StoryObj } from "@storybook/react";
import { scaleLinear } from "d3-scale";
import { geoPath } from "d3-geo";
import { geoRobinson } from "d3-geo-projection";
import type { Feature, LineString } from "geojson";

import Flow from "../components/map/Flow";
import ArrowHead from "../components/defs/marker/ArrowHead";

const width = 600;
const height = 300;
const projection = geoRobinson()
  .fitSize([width - 5, height - 5], {
    type: "Sphere",
  })
  .translate([width / 2, height / 2]);
const getLineString = (value: number = 10): Feature<LineString> => ({
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
  title: "Map Elements/Symbols/Flow",
  component: Flow,
  argTypes: {
    bend: { control: { type: "range", min: -0.4, max: 0.4, step: 0.01 } },
    projection: { table: { disable: true } },
  },
  args: {
    scale: scaleLinear().domain([0, 100]).range([0, 10]),
    projection: projection,
    datum: getLineString(),
    style: { fill: "none", stroke: "black" },
  },
  render: (args) => (
    <>
      <defs>
        <ArrowHead color={args.style?.stroke} type={args.style?.markerEnd} />
      </defs>
      <Flow {...args} />
    </>
  ),
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <path
          d={geoPath(projection)({ type: "Sphere" }) ?? ""}
          stroke={"grey"}
          strokeWidth={"0.5"}
          fill={"none"}
        />
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof Flow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultFlow: Story = {};

export const BigFlowTriangle: Story = {
  args: {
    datum: getLineString(100),
    bend: -0.2,
    style: { fill: "none", stroke: "red", opacity: 0.5, markerEnd: "triangle" },
  },
};
