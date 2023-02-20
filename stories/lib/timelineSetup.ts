import { scaleTime } from "d3";

export const timelineSetup = {
  margin: 40,
  width: 500,
  height: 100,
  scale: scaleTime()
    .domain([new Date("2010"), new Date()])
    .range([0, 500 - 40]),
};
