import { Meta, StoryObj } from "@storybook/react";
import { Text } from "theme-ui";

import Callout from "./";
import { HiCursorClick } from "react-icons/hi";

const meta = {
  title: "UI/Callout",
  component: Callout,
  args: {
    children: <Text as="p">This is a simple callout text.</Text>,
  },
} satisfies Meta<typeof Callout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultCallout: Story = {};

export const CalloutWithTitle: Story = {
  args: {
    title: "Tipp",
  },
};
export const CalloutWithCustomIcon: Story = {
  args: {
    Icon: HiCursorClick,
  },
};
