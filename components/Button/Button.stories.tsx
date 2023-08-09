import { Meta, StoryObj } from "@storybook/react";
import Button from ".";

const meta = {
  title: "UI/Button",
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultButton: Story = {
  args: {
    children: "Default Text",
  },
};
