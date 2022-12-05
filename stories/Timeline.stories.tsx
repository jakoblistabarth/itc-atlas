import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Timeline from "../components/charts/timeline/Timeline";
import EventPoint from "../components/charts/timeline/EventPoint";
import TimelineGrid from "../components/charts/timeline/TimelineGrid";
import { DefaultEventPoint } from "./EventPoint.stories";
import { DefaultEventPeriod } from "./EventPeriod.stories";
import { DefaultTimelineGrid } from "./TimelineGrid.stories";
import { scaleTime } from "d3";

const margin = DefaultTimelineGrid.args?.margin ?? 0;
const scale = DefaultTimelineGrid.args?.scale;
const width = scale?.range()[1] ?? 0 + margin;

export default {
  title: "Charts/Timeline/Timeline",
  component: Timeline,
  decorators: [
    (Story) => (
      <svg width={width} height={100}>
        <Timeline {...defaultArgs}>
          <TimelineGrid
            scale={scale ?? scaleTime()}
            height={200}
            margin={margin}
          />
          <DefaultEventPoint {...DefaultEventPoint.args} />
          <DefaultEventPeriod {...DefaultEventPeriod.args} />
          <Story />
        </Timeline>
      </svg>
    ),
  ],
} as ComponentMeta<typeof Timeline>;

const Template: ComponentStory<typeof EventPoint> = (args) => (
  <Timeline {...args} />
);

const defaultArgs = {};

export const DefaultTimeline = Template.bind({});
DefaultTimeline.args = {
  ...defaultArgs,
};
