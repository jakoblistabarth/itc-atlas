// from https://codesandbox.io/s/xenodochial-grass-js3bo9?file=/src/Tooltip.tsx

import type { Placement } from "@floating-ui/react";
import { Component, FC, createContext, useContext } from "react";
import { useTooltip } from "./useTooltip.hook";
import { TooltipTrigger } from "./TooltipTrigger";
import TooltipContent from "./TooltipContent";

export interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  followCursor?: boolean;
}

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = createContext<ContextType>(null);

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (context == null) {
    throw new Error("Tooltip components must be wrapped in <Tooltip.Root />");
  }

  return context;
};

type Props = { children: React.ReactNode } & TooltipOptions;

const Root: FC<Props> = ({ children, ...options }) => {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
};

export class Tooltip extends Component<Props> {
  static Root = Root;
  static Trigger = TooltipTrigger;
  static Content = TooltipContent;

  render() {
    return <Root>{this.props.children}</Root>;
  }
}
