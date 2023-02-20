import React, { FC } from "react";
import { Meta, StoryObj } from "@storybook/react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const Logo: FC<Props> = (args) => <Image {...args} alt={args.alt} />;
const meta = {
  title: "ui/Img",
  component: Logo,
} satisfies Meta<typeof Logo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultImage: Story = {
  args: {
    src: "./images/image.png",
    alt: "ITC Logo",
    width: 50,
    height: 50,
  },
};
