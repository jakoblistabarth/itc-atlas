import { Meta, StoryObj } from "@storybook/react";
import { randomInt } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import MapLayerProportionalSymbols from ".";
import getCentroidByIsoCode from "../../lib/data/getCentroidByIsoCode";
import getCountries from "../../lib/data/getCountries";
import MapLayerBase from "../MapLayerBase";
import MapLayout from "../MapLayout/MapLayout";

const countries = getCountries();
const width = 1000;

const meta = {
  title: "Map Layers/MapLayerProportionalSymbols",
  component: MapLayerProportionalSymbols,
  args: {
    data: ["NLD", "DEU", "TZA", "EGY"].flatMap((d) => {
      const centroid = getCentroidByIsoCode(d);
      return centroid
        ? {
            longitude: centroid.x,
            latitude: centroid.y,
            value: randomInt(10, 30)(),
            id: d,
            label: d,
          }
        : [];
    }),
  },
  argTypes: {},
  decorators: [
    (Story) => {
      return (
        <MapLayout bounds={{ width }} projection={geoBertin1953()}>
          <MapLayerBase countries={countries} />
          <Story />
        </MapLayout>
      );
    },
  ],
} satisfies Meta<typeof MapLayerProportionalSymbols>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMapLayerProportionalSymbols: Story = {};
