import { Meta, StoryObj } from "@storybook/react";

import ChapterIcon from ".";

const meta = {
  title: "UI/ChapterIcon",
  component: ChapterIcon,
  args: {
    chapter: "Appendix",
    width: "100px",
    height: "100px",
  },
} satisfies Meta<typeof ChapterIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultChapterIcon: Story = {};
export const StyledIcon: Story = {
  args: {
    chapter: "Projects",
    opacity: 0.5,
    transform: "rotate(20)",
  },
};
