import { Meta, StoryObj } from "@storybook/react";
import MapLayout from ".";
import MapLayerBase from "../MapLayerBase";
import MapLayoutBody from "./MapLayoutBody";
import MapLayoutHeader from "./MapLayoutHeader";
import { geoBertin1953 } from "d3-geo-projection";
import defaultTheme from "../../lib/styles/themes/defaultTheme";
import getCountries from "../../lib/data/getCountries";
import themes from "../../lib/styles/themes";
import projections, {
  getProjectionNames,
} from "../../stories/lib/getProjections";

const countries = getCountries();
const projection = geoBertin1953();
const bounds = {
  width: 600,
  height: 300,
  frame: { top: 10, bottom: 10, left: 10, right: 10 },
};

const meta = {
  title: "Map Elements/Layouts",
  component: MapLayout,
  argTypes: {
    theme: {
      options: Array.from(themes.keys()),
      mapping: Object.fromEntries(themes),
      control: {
        type: "select",
      },
    },
    projection: {
      options: getProjectionNames(),
      mapping: projections,
      control: {
        type: "select",
      },
    },
  },
  render: (args) => {
    return (
      <MapLayout {...args}>
        <MapLayoutHeader centered>
          <text fontSize={"2em"} dominantBaseline={"hanging"}>
            Map title
          </text>
        </MapLayoutHeader>
        <MapLayoutBody bounds={args.bounds}>
          <MapLayerBase {...args} countries={countries}></MapLayerBase>
        </MapLayoutBody>
      </MapLayout>
    );
  },
} satisfies Meta<typeof MapLayout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    debug: true,
    theme: defaultTheme,
    projection: projection,
    bounds: bounds,
  },
};

export const BigHeader: Story = {
  args: {
    debug: true,
    theme: defaultTheme,
    projection: projection,
    bounds: { width: 900, frame: { top: 100, left: 0 } },
  },
};

export const LeftAside: Story = {
  args: {
    debug: true,
    theme: defaultTheme,
    projection: projection,
    bounds: { width: 900, frame: { top: 0, left: 100 } },
  },
};
