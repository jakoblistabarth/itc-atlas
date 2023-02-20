import { Meta, StoryObj } from "@storybook/react";

import Building, { ITCLocationName } from "../components/Building";
import { Vector2 } from "three";

const width = 300;
const height = width / 2;

const meta = {
  title: "Shapes/Building",
  component: Building,
  argTypes: {
    width: {
      control: { type: "range", min: 10, max: 960, step: 1 },
    },
  },
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof Building>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBuilding: Story = {
  args: {
    width: width,
    location: ITCLocationName.DELFT1,
    position: new Vector2(width / 2, height / 2),
  },
};
