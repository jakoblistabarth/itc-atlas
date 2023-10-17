import { Meta, StoryObj } from "@storybook/react";
import KPI from ".";

const meta = {
  title: "UI/KPI",
  component: KPI,
} satisfies Meta<typeof KPI>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultKPI: Story = {
  args: {
    number: 40,
  },
};
