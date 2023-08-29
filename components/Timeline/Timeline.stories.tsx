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
  tlPoints?: React.ComponentProps<typeof EventPoint>[];
  tlPeriods?: React.ComponentProps<typeof EventPeriod>[];
  tlGrid?: React.ComponentProps<typeof TimelineGrid>;
};

const meta = {
  component: Timeline,
  title: "Charts/Timeline/Timeline",
  args: {
    xScale: scaleTime()
      .domain([new Date("2010"), new Date()])
      .range([0, 500]),
  },
  argTypes: {
    tlPoints: {
      table: {
        disable: true,
      },
    },
    tlPeriods: {
      table: {
        disable: true,
      },
    },
    tlGrid: {
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
      {args.tlGrid && <TimelineGrid {...args.tlGrid} />}
      {args.tlPoints &&
        args.tlPoints.map((args, idx) => <EventPoint key={idx} {...args} />)}
      {args.tlPeriods &&
        args.tlPeriods.map((args, idx) => <EventPeriod key={idx} {...args} />)}
    </Timeline>
  ),
};

export const Default: Story = {
  ...TimelineTemplate,
  args: {
    tlPoints: [{ ...DefaultEventPoint.args }],
    tlPeriods: [{ ...DefaultEventPeriod.args }],
    tlGrid: { ...DefaultTimelineGrid.args },
  },
};

export const WithScaledItem: Story = {
  ...TimelineTemplate,
  args: {
    tlPoints: [
      {
        date: new Date("2015"),
        y: timelineSetup.height / 2,
        radius: 5,
        drawCenter: true,
      },
      { ...ScaledEventPoint.args },
    ],
    tlGrid: {
      height: 100,
    },
  },
};
