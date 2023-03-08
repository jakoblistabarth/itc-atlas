import { Meta, StoryObj } from "@storybook/react";
import PointLabel from "../components/map/PointLabel";
import { LabelPlacement } from "../types/LabelPlacement";
import EventPeriod from "../components/charts/timeline/EventPeriod";
import { TimelineEvent } from "../types/TimelineEvent";
import { timelineSetup } from "./lib/timelineSetup";
import { Text } from "@visx/text";

const event: TimelineEvent = {
  name: "Event Period",
  yOffset: "a",
  dateStart: new Date("2012"),
  dateEnd: new Date("2022"),
};

const meta = {
  title: "Charts/Timeline/EventPeriod",
  component: EventPeriod,
  args: {
    yOffset: timelineSetup.height / 2,
    dateStart: event.dateStart,
    dateEnd: event.dateEnd ?? new Date(),
    xScale: timelineSetup.scale,
    height: 10,
  },
  decorators: [
    (Story) => (
      <svg width={timelineSetup.width} height={timelineSetup.height}>
        <Story />
      </svg>
    ),
  ],
  render: (args) => (
    <EventPeriod {...args}>
      <PointLabel placement={LabelPlacement.LEFT}>{event.name}</PointLabel>
    </EventPeriod>
  ),
} satisfies Meta<typeof EventPeriod>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultEventPeriod: Story = {};

export const StyledEventPeriod: Story = {
  args: {
    fillOpacity: 0.1,
    stroke: "teal",
  },
};

export const EventWithText: Story = {
  args: {
    fillOpacity: 0.1,
    stroke: "teal",
    children: (
      <Text fontSize={10} width={150} verticalAnchor={"start"} y={10}>
        This is a label with a rather long text, in multiple lines
      </Text>
    ),
  },
  render: (args) => {
    return <EventPeriod {...args}>{args.children}</EventPeriod>;
  },
};
