import { Meta, StoryObj } from "@storybook/react";
import Tooltip from "../components/Tooltip/Tooltip";

import TooltipContent from "../components/Tooltip/TooltipContent";
import { TooltipTrigger } from "../components/Tooltip/TooltipTrigger";

const children = (
  <div>
    <strong>34</strong> Example units
  </div>
);

const meta = {
  title: "UI/Tooltip",
  component: TooltipContent,
  args: {
    children: children,
  },
  decorators: [
    (Story) => (
      <Tooltip open>
        <Story />
        <TooltipTrigger asChild>
          <button disabled style={{ display: "none" }} />
        </TooltipTrigger>
      </Tooltip>
    ),
  ],
} satisfies Meta<typeof TooltipContent>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTooltip: Story = {};

export const NotRaisedTooltip: Story = {
  args: {
    raised: false,
  },
};
