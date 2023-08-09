import { Meta, StoryObj } from "@storybook/react";
import { getHierarchyData } from "./HierarchyTree.stories.helpers";

import HierarchyTree from ".";

const height = 300;

const meta = {
  title: "Charts/HierarchyTree",
  component: HierarchyTree,
  args: {
    height,
    hierarchy: getHierarchyData(),
  },
} satisfies Meta<typeof HierarchyTree>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultHierarchyTree: Story = {};
export const DetailedHierarchyTree: Story = {
  args: {
    height: 800,
    hierarchy: getHierarchyData(true),
  },
};
