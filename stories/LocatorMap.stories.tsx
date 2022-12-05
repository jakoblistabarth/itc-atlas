import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import LocatorMap from "../components/map/LocatorMap";
import getCountries from "../lib/data/getCountries";
import themes from "../lib/styles/themes";

const countries = getCountries();

export default {
  title: "Map Types/Locator Map",
  component: LocatorMap,
  argTypes: {
    projection: {
      table: {
        disable: true,
      },
    },
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
  args: {},
} as ComponentMeta<typeof LocatorMap>;

const Template: ComponentStory<typeof LocatorMap> = (args) => {
  return <LocatorMap {...args} />;
};

export const DefaultLocatorMap = Template.bind({});
DefaultLocatorMap.args = {
  ...Template.args,
  neCountriesTopoJson: countries,
  highlight: ["NLD"],
};

export const MultipleHighlights = Template.bind({});
MultipleHighlights.args = {
  ...DefaultLocatorMap.args,
  highlight: ["NLD", "AUT"],
};

export const NoHightlight = Template.bind({});
NoHightlight.args = {
  ...DefaultLocatorMap.args,
  highlight: [],
};

export const DifferentHemispheres = Template.bind({});
DifferentHemispheres.args = {
  ...DefaultLocatorMap.args,
  highlight: ["LAO", "CHL"],
};
