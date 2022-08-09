import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Button from "../components/Button";

export default {
  title: "UI/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

const defaultArgs: React.ComponentProps<typeof Button> = {
  outline: false,
};

export const defaultButton = Template.bind({});
defaultButton.args = {
  ...defaultArgs,
  children: "Default Text",
};
