import React from "react";
import { Meta } from "@storybook/react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "ui/Img",
} as Meta;

export const DefaultImage = () => (
  <>
    <img src={"./images/image.png"} alt={"alt text"} />
  </>
);
