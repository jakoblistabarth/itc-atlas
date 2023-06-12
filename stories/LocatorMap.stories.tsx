import { Meta, StoryObj } from "@storybook/react";
import LocatorMap from "../components/map/LocatorMap";
import getCountries from "../lib/data/getCountries";
import themes from "../lib/styles/themes";

const countries = getCountries();

const meta = {
  title: "Map Types/Locator Map",
  component: LocatorMap,
  args: {
    neCountriesTopoJson: countries,
  },
  argTypes: {
    neCountriesTopoJson: {
      table: {
        disable: true,
      },
    },
    theme: {
      options: Array.from(themes.keys()),
      mapping: Object.fromEntries(themes),
    },
    highlight: {
      control: "select",
      options: [
        [],
        ["NLD"],
        ["KEN"],
        ["NLD", "AUT", "DEU", "CHE"],
        ["ITA", "GBR"],
        ["MNG"],
        ["MNG", "BRA"],
        ["IDN"],
      ],
    },
  },
} satisfies Meta<typeof LocatorMap>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultLocatorMap: Story = {
  args: {
    highlight: ["NLD"],
  },
};

export const MultipleHighlights: Story = {
  args: {
    highlight: ["NLD", "AUT"],
  },
};

export const NoHightlight: Story = {
  args: {
    highlight: [],
  },
};

export const DifferentHemispheres: Story = {
  args: {
    highlight: ["LAO", "CHL"],
  },
};

export const WithMarkers: Story = {
  args: {
    highlight: ["IDN"],
    roundMarkers: [
      [106.5, -6],
      [110, -7.5],
    ].map((d, i) => ({
      lng: d[0],
      lat: d[1],
      label: i.toFixed(),
      fill: "red",
      labelColor: "white",
      fontSize: 7,
    })),
    rectangleMarker: [[108, 30, 114, 24]].map((d, i) => ({
      minlng: d[0],
      maxlat: d[1],
      maxlng: d[2],
      minlat: d[3],
      fill: "lightgrey",
      stroke: "black",
      strokeWidth: "1",
    })),
  },
};
