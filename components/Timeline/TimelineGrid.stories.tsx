import { StoryObj, Meta } from "@storybook/react";
import TimelineGrid from "./TimelineGrid";
import { timelineSetup } from "./Timeline.stories.helpers";
import Timeline from "./Timeline";

const meta = {
  title: "Charts/Timeline/TimelineGrid",
  component: TimelineGrid,
  decorators: [
    (Story) => (
      <svg width={timelineSetup.width} height={timelineSetup.height}>
        <Timeline xScale={timelineSetup.scale}>
          <Story />
        </Timeline>
      </svg>
    ),
  ],
} satisfies Meta<typeof TimelineGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTimelineGrid: Story = {
  args: {
    height: timelineSetup.height,
    margin: timelineSetup.margin,
  },
};
