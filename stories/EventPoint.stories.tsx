import { Meta, StoryObj } from "@storybook/react";
import PointLabel from "../components/map/PointLabel";
import { LabelPlacement } from "../types/LabelPlacement";
import EventPoint from "../components/charts/timeline/EventPoint";
import { TimelineEvent } from "../types/TimelineEvent";
import { timelineSetup } from "./lib/timelineSetup";

const event: TimelineEvent = {
  name: "Event Point",
  yOffset: "a",
  dateStart: new Date("2012"),
  size: 30,
};

const meta = {
  title: "Charts/Timeline/EventPoint",
  component: EventPoint,
  decorators: [
    (Story) => (
      <svg width={timelineSetup.width} height={timelineSetup.height}>
        <Story />
      </svg>
    ),
  ],
  render: (args) => (
    <EventPoint {...args}>
      <PointLabel placement={LabelPlacement.TOP}>{event.name}</PointLabel>
    </EventPoint>
  ),
} satisfies Meta<typeof EventPoint>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultEventPoint: Story = {
  // QUESTION: How to do this properly?
  // Can't use story args here, otherwhise import of this story in other stories would not work
  args: {
    y: timelineSetup.height / 2 - 20,
    date: event.dateStart,
    xScale: timelineSetup.scale,
    radius: 5,
    drawCenter: false,
  },
};

export const ScaledEventPoint: Story = {
  args: {
    ...DefaultEventPoint.args,
    radius: event.size ?? 0,
    fillOpacity: 0.1,
    stroke: "black",
    drawCenter: true,
  },
};
