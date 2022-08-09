import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import LocatorMap from "../components/map/LocatorMap";

// import countriesIso from "/countriesIso.json";
// QUESTION: how does this work?
// see: https://storybook.js.org/docs/react/configure/images-and-assets#serving-static-files-via-storybook-configuration
// already added the sotries/assets/ folder to static dirs in storybook's main.js

export default {
  title: "Cartographic/Locator Map",
  component: LocatorMap,
  argTypes: {
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

const Template: ComponentStory<typeof LocatorMap> = (
  args,
  { loaded: { countries } }
) => {
  return <LocatorMap {...args} neCountriesTopoJson={countries} />;
};

export const Simple = Template.bind({});
Simple.args = {
  ...Template.args,
  highlight: ["NLD"],
};

export const MultipleHighlights = Template.bind({});
MultipleHighlights.args = {
  ...Template.args,
  highlight: ["NLD", "AUT"],
};

export const NoHightlight = Template.bind({});
NoHightlight.args = {
  ...Template.args,
  highlight: [],
};

export const DifferentHemispheres = Template.bind({});
DifferentHemispheres.args = {
  ...Template.args,
  highlight: ["LAO", "CHL"],
};
