import { Meta, StoryObj } from "@storybook/react";
import LabelPoint from "../LabelPoint";
import { LabelPlacement } from "../../types/LabelPlacement";
import EventPeriod from "./EventPeriod";
import { TimelineEvent } from "../../types/TimelineEvent";
import { timelineSetup } from "./Timeline.stories.helpers";
import { Text } from "@visx/text";
import Timeline from "./Timeline";

const event: TimelineEvent = {
  name: "Event Period",
  yOffset: "a",
  dateStart: new Date("2012"),
  dateEnd: new Date("2022"),
};

const meta = {
  title: "Charts/Timeline/EventPeriod",
  component: EventPeriod,
  decorators: [
    (Story) => (
      <svg width={timelineSetup.width} height={timelineSetup.height}>
        <Timeline xScale={timelineSetup.scale}>
          <Story />
        </Timeline>
      </svg>
    ),
  ],
  render: (args) => (
    <EventPeriod {...args}>
      <LabelPoint placement={LabelPlacement.LEFT}>{event.name}</LabelPoint>
      {args.children}
    </EventPeriod>
  ),
} satisfies Meta<typeof EventPeriod>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultEventPeriod: Story = {
  // QUESTION: How to do this properly?
  // Can't use story args here, otherwhise import of this story in other stories would not work
  args: {
    yOffset: timelineSetup.height / 2,
    dateStart: event.dateStart,
    dateEnd: event.dateEnd ?? new Date(),
    height: 10,
  },
};

export const StyledEventPeriod: Story = {
  args: {
    ...DefaultEventPeriod.args,
    fillOpacity: 0.1,
    stroke: "teal",
  },
};

export const EventWithText: Story = {
  args: {
    ...DefaultEventPeriod.args,
    fillOpacity: 0.1,
    stroke: "teal",
    children: (
      <Text fontSize={10} width={150} verticalAnchor={"start"} y={10}>
        This is a label with a rather long text, in multiple lines
      </Text>
    ),
  },
};
