import { ScaleTime, scaleTime } from "d3";
import { createContext } from "react";

type Context = {
  xScale: ScaleTime<number, number>;
};

export const TimelineContext = createContext<Context>({
  xScale: scaleTime()
    .domain([new Date("1950"), new Date()])
    .range([0, 100]),
});
