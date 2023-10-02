import { Meta, StoryObj } from "@storybook/react";
import { geoPath } from "d3-geo";
import { geoRobinson } from "d3-geo-projection";
import eth from "../../lib/styles/themes/eth";

import LabelArea from ".";

const width = 600;
const height = 300;
const projection = geoRobinson()
  .fitSize([width - 5, height - 5], {
    type: "Sphere",
  })
  .translate([width / 2, height / 2]);

const meta = {
  title: "Map Elements/Labels/LabelArea",
  component: LabelArea,
  parameters: {
    status: {
      type: "beta",
    },
  },
  args: {
    children: "Label Text",
    graticuleType: "lon",
    degree: 10,
    xOffset: 0,
    yOffset: 10,
    projection: projection,
    style: eth.label,
  },
  argTypes: {
    degree: { control: { type: "range", min: -180, max: 180, step: 10 } },
    textOriginDegree: {
      control: { type: "range", min: -180, max: 180, step: 10 },
    },
    projection: { table: { disable: true } },
  },
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
} satisfies Meta<typeof LabelArea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LonLabelArea: Story = {};

export const LatLabelArea: Story = {
  args: {
    graticuleType: "lat",
  },
};
