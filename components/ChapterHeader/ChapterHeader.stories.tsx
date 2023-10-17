import { Meta, StoryObj } from "@storybook/react";

import ChapterHeader from ".";

const meta = {
  title: "UI/ChapterHeader",
  component: ChapterHeader,
  args: {
    chapterName: "Chapter Name",
  },
} satisfies Meta<typeof ChapterHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultChapterHeader: Story = {};
