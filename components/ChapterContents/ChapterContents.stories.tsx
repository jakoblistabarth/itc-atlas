import { Meta, StoryObj } from "@storybook/react";

import ChapterContents from ".";

const meta = {
  title: "UI/ChapterContents",
  component: ChapterContents,
  args: {
    highlights: [
      { title: "Highlight A", href: "/highlight-a" },
      { title: "Highlight B", href: "/highlight-b" },
    ],
  },
} satisfies Meta<typeof ChapterContents>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultChapterContents: Story = {};
