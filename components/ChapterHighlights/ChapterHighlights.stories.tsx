import { Meta, StoryObj } from "@storybook/react";

import ChapterHighlights from ".";

const meta = {
  title: "UI/ChapterHighlights",
  component: ChapterHighlights,
  args: {
    highlights: [
      { title: "Highlight A", href: "/highlight-a" },
      { title: "Highlight B", href: "/highlight-b" },
    ],
  },
} satisfies Meta<typeof ChapterHighlights>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultChapterHighlights: Story = {};
