import { Meta, StoryObj } from "@storybook/react";
import Select from ".";

const meta = {
  title: "UI/Select",
  component: Select,
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultSelect: Story = {
  args: {
    label: "Projection",
    placeholder: "Select a map projection…",
    options: ["Mollweide", "Mercator", "Winkel Tripel"],
  },
};
