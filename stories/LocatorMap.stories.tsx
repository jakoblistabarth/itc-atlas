import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import LocatorMap from "../components/map/LocatorMap";
import getCountries from "../lib/data/getCountries";
import themes from "../lib/styles/themes";

const countries = getCountries();

export default {
  title: "Cartographic/Locator Map",
  component: LocatorMap,
  argTypes: {
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
  args: {
    projection: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof LocatorMap>;

const Template: ComponentStory<typeof LocatorMap> = (args) => {
  return <LocatorMap {...args} />;
};

export const Simple = Template.bind({});
Simple.args = {
  ...Template.args,
  neCountriesTopoJson: countries,
  highlight: ["NLD"],
};

export const MultipleHighlights = Template.bind({});
MultipleHighlights.args = {
  ...Simple.args,
  highlight: ["NLD", "AUT"],
};

export const NoHightlight = Template.bind({});
NoHightlight.args = {
  ...Simple.args,
  highlight: [],
};

export const DifferentHemispheres = Template.bind({});
DifferentHemispheres.args = {
  ...Simple.args,
  highlight: ["LAO", "CHL"],
};
