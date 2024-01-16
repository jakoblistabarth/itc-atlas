import { Meta, StoryObj } from "@storybook/react";

import ChapterNavigation from ".";

const meta = {
  title: "UI/ChapterNavigation",
  component: ChapterNavigation,
} satisfies Meta<typeof ChapterNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
