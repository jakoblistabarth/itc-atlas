import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import getTestData from "./lib/getTestData";
import getBigTestData from "./lib/getBigTestData";
import * as aq from "arquero";

import SummaryTable from "../components/SummaryTable";

export default {
  title: "SummaryTable/SummaryTable",
  component: SummaryTable,
} as ComponentMeta<typeof SummaryTable>;

const Template: ComponentStory<typeof SummaryTable> = (args) => (
  <SummaryTable {...args} />
);

export const DefaultSummaryTable = Template.bind({});
DefaultSummaryTable.args = {
  data: aq.from(getTestData()),
};

export const SummaryTableWithTitle = Template.bind({});
SummaryTableWithTitle.args = {
  data: aq.from(getBigTestData()),
  title: "Fake Staff Data",
};
