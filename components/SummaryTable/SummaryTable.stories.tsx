import { Meta, StoryObj } from "@storybook/react";
import { getTestData, getBigTestData } from "./SummaryTable.stories.helpers";
import * as aq from "arquero";

import SummaryTable from ".";

const meta = {
  title: "SummaryTable/SummaryTable",
  component: SummaryTable,
} satisfies Meta<typeof SummaryTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultSummaryTable: Story = {
  args: {
    data: aq.from(getTestData()),
  },
};

export const SummaryTableWithTitle: Story = {
  args: {
    data: aq.from(getBigTestData()),
    title: "Fake Staff Data",
  },
};
