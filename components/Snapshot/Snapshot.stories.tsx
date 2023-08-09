import { Meta, StoryObj } from "@storybook/react";
import * as aq from "arquero";
import { getTestData } from "../SummaryTable/SummaryTable.stories.helpers";

import Snapshot from ".";
import { getSummaryTableData } from "../SummaryTable/SummaryTable.helpers";

const tb = aq.from(getTestData());
const stdata = getSummaryTableData(tb);

const meta: Meta<typeof Snapshot> = {
  component: Snapshot,
  title: "SummaryTable/Snapshot",
};
export default meta;

type Story = StoryObj<typeof Snapshot>;

const defaultArgs = {
  detailed: false,
};

export const NominalSnapshot: Story = {
  args: {
    ...defaultArgs,
    column: stdata[0],
  },
};

export const ContinuousSnapshot: Story = {
  args: {
    ...defaultArgs,
    column: stdata[5],
  },
};

export const ArraySnapshot: Story = {
  args: {
    ...defaultArgs,
    column: stdata[6],
  },
};

export const DateSnapshot: Story = {
  args: {
    ...defaultArgs,
    column: stdata[4],
  },
};
