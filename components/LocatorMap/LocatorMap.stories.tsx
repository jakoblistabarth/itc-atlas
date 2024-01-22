import { Meta, StoryObj } from "@storybook/react";
import LocatorMap from ".";
import getCountries from "../../lib/data/getCountries";
import themes from "../../lib/styles/themes";

const countries = getCountries();

const meta = {
  title: "Map Types/LocatorMap",
  component: LocatorMap,
  args: {
    neCountriesTopoJson: countries,
    highlight: ["NLD"],
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

export const DefaultLocatorMap: Story = {};

export const LocatorMapWithShading: Story = {
  args: {
    shaded: true,
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
    ].map(([longitude, latitude], i) => ({
      longitude,
      latitude,
      label: i.toFixed(),
      fill: "red",
      labelColor: "white",
      fontSize: 7,
    })),
    rectangleMarkers: [
      {
        bounds: [108, -3, 114, 3],
        stroke: "black",
        strokeWidth: "1",
      },
    ],
  },
};

export const WithMultipleMarkRectangle: Story = {
  args: {
    highlight: ["ITA"],
    rectangleMarkers: [
      {
        bounds: [-10, 35, 35, 60],
        stroke: "black",
        strokeWidth: "1",
      },
      {
        bounds: [40, 10, 50, 20],
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
        bounds: [-78, -58, -65, -15],
        stroke: "black",
        strokeWidth: "1",
      },
      {
        bounds: [-82, -6, -75, 3],
        stroke: "black",
        strokeWidth: "1",
      },
    ],
  },
};
