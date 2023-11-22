import { Meta, StoryObj } from "@storybook/react";
import { randomInt, range } from "d3";
import Tooltip from ".";
import LineChart from "../Timeline/LineChart";

const children = (
  <div>
    <strong>34</strong> Example units
  </div>
);

const meta = {
  title: "UI/Tooltip",
  component: Tooltip.Content,
  args: {
    children: children,
  },
  decorators: [
    (Story) => (
      <Tooltip.Root open>
        <Story />
        <Tooltip.Trigger asChild>
          <button disabled style={{ display: "none" }} />
        </Tooltip.Trigger>
      </Tooltip.Root>
    ),
  ],
} satisfies Meta<typeof Tooltip.Content>;
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
