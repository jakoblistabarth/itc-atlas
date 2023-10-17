import { Meta, StoryObj } from "@storybook/react";
import Section from ".";

const meta = {
  title: "UI/Section",
  component: Section,
} satisfies Meta<typeof Section>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultSection: Story = {
  args: {
    children: "Default Text",
  },
};
