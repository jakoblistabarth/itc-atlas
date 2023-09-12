import { Meta, StoryObj } from "@storybook/react";
import { scaleLinear } from "d3";
import { geoEqualEarth } from "d3-geo";
import Mark from ".";
import Iso from "../Iso";
import MapLayerGraticule from "../MapLayerGraticule";
import MapLayout from "../MapLayout";
import LocationPin from "./LocationPin";

const width = 600;
const height = 300;

const meta = {
  title: "Map Elements/Marks/Mark",
  component: Mark,
  args: {
    latitude: 0,
    longitude: 0,
    children: <rect width={10} height={10} />,
  },
  decorators: [
    (Story) => (
      <MapLayout bounds={{ width, height }} projection={geoEqualEarth()}>
        <MapLayerGraticule />
        <Story />
      </MapLayout>
    ),
  ],
  render: (args) => (
    <>
      <Mark {...args} />
      <Mark {...args}>
        <LocationPin />
      </Mark>
    </>
  ),
} satisfies Meta<typeof Mark>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMark: Story = {};

export const RotatedMark: Story = {
  args: {
    children: (
      <>
        <rect width={10} height={10} transform="rotate(45) translate(-5 -5)" />
      </>
    ),
  },
};

export const MarkWithIso: Story = {
  args: {
    children: (
      <Iso
        side={20}
        value={0.5}
        style={{ fill: "yellow", fillOpacity: 1 }}
        scaleHeight={scaleLinear().domain([0, 1]).range([0, 50])}
      />
    ),
  },
};
