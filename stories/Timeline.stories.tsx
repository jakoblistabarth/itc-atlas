import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Timeline from "../components/charts/timeline/Timeline";
import TimelineGrid from "../components/charts/timeline/TimelineGrid";
import { DefaultEventPoint } from "./EventPoint.stories";
import { DefaultEventPeriod } from "./EventPeriod.stories";
import { DefaultTimelineGrid } from "./TimelineGrid.stories";
import { scaleTime } from "d3";
import EventPoint from "../components/charts/timeline/EventPoint";
import EventPeriod from "../components/charts/timeline/EventPeriod";

const margin = DefaultTimelineGrid.args?.margin ?? 0;
const scale = DefaultTimelineGrid.args?.scale;
const width = scale?.range()[1] ?? 0 + margin;

const meta: Meta<typeof Timeline> = {
  component: Timeline,
  title: "Charts/Timeline/Timeline",
  decorators: [
    (Story) => (
      <svg width={width} height={100}>
        <Timeline>
          <TimelineGrid
            scale={scale ?? scaleTime()}
            height={200}
            margin={margin}
          />
          <Story />
        </Timeline>
      </svg>
    ),
  ],
  render: (
    args //TODO: fix typing for args? sb documentation not clear for me at this point
  ) => (
    <Timeline {...args}>
      <EventPoint {...DefaultEventPoint.args} />
      <EventPeriod {...DefaultEventPeriod.args} />
    </Timeline>
  ),
};
export default meta;

type Story = StoryObj<typeof Timeline>;

export const DefaultTimeline: Story = {
  args: {},
};
