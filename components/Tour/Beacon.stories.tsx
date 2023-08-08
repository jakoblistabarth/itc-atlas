import { Meta, StoryObj } from "@storybook/react";

import Beacon from "./Beacon";

const meta = {
  title: "UI/Beacon",
  component: Beacon,
} satisfies Meta<typeof Beacon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBeacon: Story = {};
