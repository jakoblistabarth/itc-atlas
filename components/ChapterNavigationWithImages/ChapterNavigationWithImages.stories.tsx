import { Meta, StoryObj } from "@storybook/react";

import ChapterNavigationWithImages from ".";

const meta = {
  title: "UI/ChapterNavigationWithImages",
  component: ChapterNavigationWithImages,
  args: {
    chapter: "Appendix",
    width: "100px",
    height: "100px",
  },
} satisfies Meta<typeof ChapterNavigationWithImages>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
