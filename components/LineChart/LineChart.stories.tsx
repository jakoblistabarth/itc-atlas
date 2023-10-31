import { Meta, StoryObj } from "@storybook/react";

import LineChart from ".";
import { scaleOrdinal, schemeCategory10 } from "d3";

const meta = {
  title: "Charts/LineChart",
  component: LineChart,
  args: {
    xLabel: "Year",
    yLabel: "Sandwiches",
    data: [
      {
        id: "NLD",
        label: "Netherlands",
        data: [
          { x: 2000, y: 1 },
          { x: 2004, y: 3 },
          { x: 2010, y: 1 },
        ],
      },
      {
        id: "DEU",
        label: "Germany",
        data: [
          { x: 2001, y: 1 },
          { x: 2002, y: 2 },
          { x: 2003, y: 3 },
          { x: 2006, y: 4 },
          { x: 2007, y: 3 },
        ],
      },
    ],
    mouseEnterLeaveHandler: () => undefined,
    colorScale: scaleOrdinal<string, string>().range(schemeCategory10),
  },
  decorators: [
    (Story) => (
      <div className="h-[400px] w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LineChart>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultLineChart: Story = {};
