import { Meta, StoryObj } from "@storybook/react";

import LinePath from ".";
import { randomInt, range, scaleLinear } from "d3";
import AxisX from "../AxisX";
import AxisY from "../AxisY";
import RuleY from "../RuleY";

const width = 486;
const height = 300;
const margin = 20;
const maxValue = 50;
const minTime = 2000;
const maxTime = 2020;

const meta = {
  title: "Charts/LineChart",
  component: LinePath,
  args: {
    data: range(minTime, maxTime + 1).map((d) => ({
      x: d,
      y: randomInt(maxValue + 1)(),
    })),
    xScale: scaleLinear()
      .domain([minTime, maxTime])
      .range([margin, width - margin]),
    yScale: scaleLinear()
      .domain([0, maxValue])
      .range([height - margin, margin]),
    identifier: "Sample Data",
    isFocus: true,
    isSelected: true,
    isSelection: false,
    mouseEnterLeaveHandler: () => {
      console.log("mouse");
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: width, height: height }}>
        <svg width={"100%"} height={"100%"} viewBox={`0 0 ${width} ${height}`}>
          <AxisX top={height - margin} xScale={meta.args.xScale} />
          <AxisY left={margin} yScale={meta.args.yScale} />
          <RuleY xScale={meta.args.xScale} yScale={meta.args.yScale} />
          <Story />
        </svg>
      </div>
    ),
  ],
} satisfies Meta<typeof LinePath>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultLineChart: Story = {};
