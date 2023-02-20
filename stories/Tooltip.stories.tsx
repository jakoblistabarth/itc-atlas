import { Meta, StoryObj } from "@storybook/react";

import Tooltip from "../components/Tooltip";

const children = (
  <div>
    <strong>34</strong> Example units
  </div>
);

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  args: {
    raised: false,
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTooltip: Story = {
  args: {
    children: children,
  },
};

export const RaisedTooltip: Story = {
  args: {
    raised: true,
    children: children,
  },
};
