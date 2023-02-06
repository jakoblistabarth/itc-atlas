import { Meta, StoryObj } from "@storybook/react";
import { nanoid } from "nanoid";
import MyList from "../components/MyList";
import MyListElement from "../components/MyListElement";
import {
  MyListElementDefault,
  MyListElementHighlight,
} from "./ListElement.stories";

const meta: Meta<typeof MyList> = {
  component: MyList,
  title: "UI/MyList",
};
export default meta;

type Story = StoryObj<typeof MyList>;

const ListTemplate: Story = {
  render: ({ items, ...args }) => (
    <MyList {...args}>
      {items.map((item) => (
        <MyListElement {...item} key={nanoid()} />
      ))}
    </MyList>
  ),
};

export const Empty = {
  ...ListTemplate,
  args: {
    items: [],
  },
};

export const OneItem = {
  ...ListTemplate,
  args: {
    items: [{ ...MyListElementHighlight }],
  },
};

export const TwoItems = {
  ...ListTemplate,
  args: {
    items: [{ ...MyListElementHighlight }, { ...MyListElementDefault }],
  },
};
