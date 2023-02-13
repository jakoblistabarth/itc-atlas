import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Timeline from "../components/charts/timeline/Timeline";
import TimelineGrid from "../components/charts/timeline/TimelineGrid";
import { DefaultEventPoint } from "./EventPoint.stories";
import { DefaultEventPeriod } from "./EventPeriod.stories";
import { DefaultTimelineGrid } from "./TimelineGrid.stories";
import EventPoint from "../components/charts/timeline/EventPoint";
import EventPeriod from "../components/charts/timeline/EventPeriod";
import { nanoid } from "nanoid";
import { scaleTime } from "d3";
import { timelineSetup } from "../lib/sbTimelineSetup";

// const margin = DefaultTimelineGrid.args?.margin ?? 0;
// const scale = DefaultTimelineGrid.args?.scale;
// const width = scale?.range()[1] ?? 0 + margin;

type TimelineElements = {
  points: React.ComponentProps<typeof EventPoint>[];
  periods: React.ComponentProps<typeof EventPeriod>[];
  grid: React.ComponentProps<typeof TimelineGrid>;
};

const meta: Meta<React.ComponentProps<typeof Timeline> & TimelineElements> = {
  component: Timeline,
  title: "Charts/Timeline/Timeline",
  subcomponents: {},
  decorators: [
    (Story) => (
      <svg width={timelineSetup.width} height={100}>
        <Story />
      </svg>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const TimelineTemplate: Story = {
  render: ({ ...args }) => (
    <Timeline {...args}>
      {args.grid && <TimelineGrid {...args.grid} />}
      {args.points &&
        args.points.map(({ ...args }) => (
          <EventPoint key={nanoid()} {...args} />
        ))}
      {args.periods &&
        args.periods.map(({ ...args }) => (
          <EventPeriod key={nanoid()} {...args} />
        ))}
    </Timeline>
  ),
};

export const ReusingStories: Story = {
  ...TimelineTemplate,
  args: {
    points: [{ ...DefaultEventPoint.args }],
    periods: [{ ...DefaultEventPeriod.args }],
    grid: { ...DefaultTimelineGrid.args },
  },
};

export const ManualItems: Story = {
  ...TimelineTemplate,
  args: {
    points: [
      {
        date: new Date("2015"),
        y: timelineSetup.height / 2,
        xScale: scaleTime()
          .domain([new Date("2010"), new Date()])
          .range([0, 500]),
        radius: 5,
        drawCenter: true,
      },
    ],
    grid: {
      scale: scaleTime()
        .domain([new Date("2010"), new Date()])
        .range([0, 500]),
      height: 100,
    },
  },
};
