import { Meta, StoryObj } from "@storybook/react";
import { nanoid } from "nanoid";
import MyList from "../components/MyList";
import MyListElement from "../components/MyListElement";
import {
  MyListElementDefault,
  MyListElementHighlight,
} from "./ListElement.stories";

const meta: Meta<
  React.ComponentProps<typeof MyList> & {
    items: React.ComponentProps<typeof MyListElement>[];
  }
> = {
  component: MyList,
  title: "UI/MyList",
};

export default meta;
type Story = StoryObj<typeof meta>;

const ListTemplate: Story = {
  render: ({ ...args }) => (
    <MyList {...args}>
      {args.items.map((item) => (
        <MyListElement {...item} key={nanoid()} />
      ))}
    </MyList>
  ),
};

export const Empty: Story = {
  ...ListTemplate,
  args: {
    items: [],
  },
};

export const OneItem: Story = {
  ...ListTemplate,
  args: {
    items: [{ ...MyListElementHighlight.args }],
  },
};

export const TwoItems: Story = {
  ...ListTemplate,
  args: {
    items: [
      { ...MyListElementHighlight.args },
      { ...MyListElementDefault.args },
    ],
  },
};
