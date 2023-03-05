import { Meta, StoryObj } from "@storybook/react";
import { range, randomInt } from "d3";
import LineChart from "../components/charts/timeline/LineChart";
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

export const TooltipWithSparkline: Story = {
  args: {
    children: (
      <>
        <div>
          <strong>{"NDL"}</strong>
          <br />
          10 MSc alumni
        </div>
        <div>
          <LineChart
            data={range(1950, 2023).map((d) => ({
              x: d,
              y: Math.random() < 0.4 ? 0 : randomInt(0, 60)(),
            }))}
            width={100}
            height={30}
          />
        </div>
      </>
    ),
  },
};
