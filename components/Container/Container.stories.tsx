import { Meta, StoryObj } from "@storybook/react";
import Container from ".";

const meta = {
  title: "UI/Container",
  component: Container,
} satisfies Meta<typeof Container>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultContainer: Story = {
  args: {
    children: "Default Text",
  },
};
