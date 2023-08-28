import { ScaleTime } from "d3";
import { createContext, useContext } from "react";

type Context = {
  left?: number;
  top?: number;
  xScale: ScaleTime<number, number>;
};

export const TimelineContext = createContext<Context | null>(null);

export const useTimelineContext = () => {
  const context = useContext(TimelineContext);

  if (context == null) {
    throw new Error("Timeline components must be wrapped in <Timeline />");
  }

  return context;
};
