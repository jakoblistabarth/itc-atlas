import { Meta, StoryObj } from "@storybook/react";
import Teaser from ".";

const meta = {
  title: "UI/Teaser",
  component: Teaser,
} satisfies Meta<typeof Teaser>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTeaser: Story = {
  args: {
    children:
      "Without efficient, transparent bloatware, you will lack cross-media CAE. Quick: do you have a plan to become cross-media?",
  },
};
