import { Meta, StoryObj } from "@storybook/react";
import ListElement from "../components/MyListElement";

const meta: Meta<typeof ListElement> = {
  component: ListElement,
  title: "UI/ListElement",
};
export default meta;

type Story = StoryObj<typeof ListElement>;

export const DefaultListElement: Story = {
  args: {
    highlight: false,
    children: "Element Text",
  },
};

export const HighlightListElement: Story = {
  args: {
    highlight: true,
    children: "Element Text",
  },
};
