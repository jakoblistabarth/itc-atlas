import { Meta, StoryObj } from "@storybook/react";
import MyListElement from "../components/MyListElement";

const meta: Meta<typeof MyListElement> = {
  component: MyListElement,
  title: "UI/MyListElement",
};
export default meta;

type Story = StoryObj<typeof MyListElement>;

export const MyListElementDefault: Story = {
  args: {
    highlight: false,
    children: "Element Text",
  },
};

export const MyListElementHighlight: Story = {
  args: {
    highlight: true,
    children: "Element Text",
  },
};
