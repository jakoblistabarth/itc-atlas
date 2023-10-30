import { Meta, StoryObj } from "@storybook/react";

import { Card } from ".";

const meta = {
  title: "UI/Card",
  component: Card,
  args: {
    children: (
      <>
        <Card.Header>Header</Card.Header>
        <Card.Body>This is the card&apos;s body</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </>
    ),
  },
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultCard: Story = {};
