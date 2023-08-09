import { Meta, StoryObj } from "@storybook/react";
import Timeline from ".";
import TimelineGrid from "./TimelineGrid";
import { DefaultEventPoint, ScaledEventPoint } from "./EventPoint.stories";
import { DefaultEventPeriod } from "./EventPeriod.stories";
import { DefaultTimelineGrid } from "./TimelineGrid.stories";
import EventPoint from "./EventPoint";
import EventPeriod from "./EventPeriod";
import { scaleTime } from "d3";
import { timelineSetup } from "./Timeline.stories.helpers";

type TimelineElements = {
  points?: React.ComponentProps<typeof EventPoint>[];
  periods?: React.ComponentProps<typeof EventPeriod>[];
  grid?: React.ComponentProps<typeof TimelineGrid>;
};

const meta = {
  component: Timeline,
  title: "Charts/Timeline/Timeline",
  argTypes: {
    points: {
      table: {
        disable: true,
      },
    },
    periods: {
      table: {
        disable: true,
      },
    },
    grid: {
      table: {
        disable: true,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <svg width={timelineSetup.width} height={timelineSetup.height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<React.ComponentProps<typeof Timeline> & TimelineElements>;

export default meta;
type Story = StoryObj<typeof meta>;

const TimelineTemplate: Story = {
  render: (args) => (
    <Timeline {...args}>
      {args.grid && <TimelineGrid {...args.grid} />}
      {args.points &&
        args.points.map((args, idx) => <EventPoint key={idx} {...args} />)}
      {args.periods &&
        args.periods.map((args, idx) => <EventPeriod key={idx} {...args} />)}
    </Timeline>
  ),
};

export const Default: Story = {
  ...TimelineTemplate,
  args: {
    points: [{ ...DefaultEventPoint.args }],
    periods: [{ ...DefaultEventPeriod.args }],
    grid: { ...DefaultTimelineGrid.args },
  },
};

export const WithScaledItem: Story = {
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
      { ...ScaledEventPoint.args },
    ],
    grid: {
      scale: scaleTime()
        .domain([new Date("2010"), new Date()])
        .range([0, 500]),
      height: 100,
    },
  },
};
