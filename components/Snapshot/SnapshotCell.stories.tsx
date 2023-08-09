import { Meta, StoryObj } from "@storybook/react";

import SnapshotCell from "./SnapshotCell";

const meta = {
  title: "SummaryTable/SnapShotCell",
  component: SnapshotCell,
  decorators: [
    (Story) => (
      <svg width={200} height={30}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof SnapshotCell>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultSnapshotCell: Story = {
  args: {
    x: 1,
    y: 1,
    width: 198,
    height: 28,
    fill: "lightgrey",
  },
};
