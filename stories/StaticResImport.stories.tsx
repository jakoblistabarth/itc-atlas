import React from "react";
import { Meta } from "@storybook/react";

import airports from "../data/topographic/airports.json";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "ui/Img",
} as Meta;

export const DefaultImage = () => (
  <>
    <pre>{JSON.stringify(airports.slice(0, 2), null, 2)}</pre>
    <img src={"./images/image.png"} alt={"alt text"} />
  </>
);
