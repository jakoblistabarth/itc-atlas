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
    ].map(([lng, lat], i) => ({
      lng,
      lat,
      label: i.toFixed(),
      fill: "red",
      labelColor: "white",
      fontSize: 7,
    })),
    rectangleMarkers: [
      {
        bounds: [108, 30, 114, 24],
        stroke: "black",
        strokeWidth: "1",
      },
    ],
  },
};

export const WithMultipleRectangleMarkers: Story = {
  args: {
    highlight: ["ITA"],
    rectangleMarkers: [
      {
        bounds: [-10, 60, 35, 35],
        stroke: "black",
        strokeWidth: "1",
      },
      {
        bounds: [40, 20, 50, 10],
        stroke: "black",
        strokeWidth: "1",
      },
    ],
  },
};

export const WithRectanglesInSouthernHemisphere: Story = {
  args: {
    highlight: ["CHL"],
    rectangleMarkers: [
      {
        bounds: [-78, -15, -65, -58],
        stroke: "black",
        strokeWidth: "1",
      },
      {
        bounds: [-82, 3, -75, -6],
        stroke: "black",
        strokeWidth: "1",
      },
    ],
  },
};
