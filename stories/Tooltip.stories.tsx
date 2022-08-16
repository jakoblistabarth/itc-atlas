import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Tooltip from "../components/Tooltip";

const children = (
  <div>
    <strong>34</strong> Example units
  </div>
);

export default {
  title: "UI/Tooltip",
  component: Tooltip,
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => (
  <Tooltip {...args}>{args.children}</Tooltip>
);

const defaultArgs: React.ComponentProps<typeof Tooltip> = {
  raised: false,
};

export const defaultTooltip = Template.bind({});
defaultTooltip.args = {
  ...defaultArgs,
  children: children,
};

export const tooltipRaised = Template.bind({});
tooltipRaised.args = {
  ...defaultArgs,
  raised: true,
  children: children,
};
