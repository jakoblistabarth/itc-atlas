import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SnapshotCell from "../components/SnapshotCell";

export default {
  title: "SummaryTable/SnapShotCell",
  component: SnapshotCell,
  decorators: [
    (Story) => (
      <svg width={200} height={30}>
        <Story />
      </svg>
    ),
  ],
} as ComponentMeta<typeof SnapshotCell>;

const Template: ComponentStory<typeof SnapshotCell> = (args) => (
  <SnapshotCell {...args} />
);

const defaultArgs = {
  x: 1,
  y: 1,
  width: 198,
  height: 28,
  fill: "lightgrey",
};

export const defaultSnapShotCell = Template.bind({});
defaultSnapShotCell.args = {
  ...defaultArgs,
};
