import { Meta, StoryObj } from "@storybook/react";
import ThemeSwitch from ".";

const meta = {
  title: "UI/ThemeSwitch",
  component: ThemeSwitch,
} satisfies Meta<typeof ThemeSwitch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultThemeSwitch: Story = {
  args: {},
};
