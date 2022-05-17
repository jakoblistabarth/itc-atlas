import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import LocatorMap from "../components/map/LocatorMap";

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
  return <LocatorMap {...args} data={countries} />;
};

export const Simple = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
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
