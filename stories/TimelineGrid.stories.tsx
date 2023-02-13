import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import TimelineGrid from "../components/charts/timeline/TimelineGrid";
import { timelineSetup } from "../lib/sbTimelineSetup";

const meta = {
  title: "Charts/Timeline/TimelineGrid",
  component: TimelineGrid,
  decorators: [
    (Story) => (
      <svg width={timelineSetup.width} height={timelineSetup.height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof TimelineGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTimelineGrid = {
  args: {
    scale: timelineSetup.scale,
    height: timelineSetup.height,
    margin: timelineSetup.margin,
  },
};
