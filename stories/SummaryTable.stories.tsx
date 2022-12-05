import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DataFrame from "../lib/DataFrame/DataFrame";
import getTestData from "../lib/DataFrame/getTestData";

import SummaryTable from "../components/SummaryTable";
import getBigTestData from "../lib/DataFrame/getBigTestData";

const df = new DataFrame(getTestData());
const dfBig = new DataFrame(getBigTestData());

export default {
  title: "SummaryTable/SummaryTable",
  component: SummaryTable,
} as ComponentMeta<typeof SummaryTable>;

const Template: ComponentStory<typeof SummaryTable> = (args) => (
  <SummaryTable {...args} />
);

export const DefaultSummaryTable = Template.bind({});
DefaultSummaryTable.args = {
  data: df,
};

export const SummaryTableWithTitle = Template.bind({});
SummaryTableWithTitle.args = {
  data: dfBig,
  title: "Fake Staff Data",
};
