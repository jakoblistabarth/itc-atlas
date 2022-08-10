import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DataFrame from "../lib/DataFrame/DataFrame";
import getTestData from "../lib/DataFrame/getTestData";

import Snapshot from "../components/Snapshot";

const df = new DataFrame(getTestData());

export default {
  title: "SummaryTable/Snapshot",
  component: Snapshot,
} as ComponentMeta<typeof Snapshot>;

const Template: ComponentStory<typeof Snapshot> = (args) => (
  <Snapshot {...args} />
);

const defaultArgs = {
  detailed: false,
};

export const NominalSnapshot = Template.bind({});
NominalSnapshot.args = {
  ...defaultArgs,
  column: df.getColumn("name"),
  columnName: "Name",
};

export const ContinuousSnapshot = Template.bind({});
ContinuousSnapshot.args = {
  ...defaultArgs,
  column: df.getColumn("height"),
  columnName: "Height",
};

export const ArraySnapshot = Template.bind({});
ArraySnapshot.args = {
  ...defaultArgs,
  column: df.getColumn("pinArray"),
  columnName: "PIN",
};

export const DateSnapshot = Template.bind({});
DateSnapshot.args = {
  ...defaultArgs,
  column: df.getColumn("dateOfBirth"),
  columnName: "Date of Birth",
};
