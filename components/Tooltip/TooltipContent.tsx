import { FloatingPortal, useMergeRefs } from "@floating-ui/react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { useTooltipContext } from "./Tooltip";

type Props = {
  raised?: boolean;
  left?: number;
  top?: number;
};

const TooltipContent = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & Props
>(function TooltipContent({ raised = true, left, top, ...props }, propRef) {
  const context = useTooltipContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);
  return !context.open ? null : (
    <FloatingPortal>
      <div
        className={twMerge(
          "pointer-events-none z-50 rounded-sm bg-white p-3 text-xs shadow-lg dark:bg-itc-green-800",
          raised && "shadow-md",
        )}
        ref={ref}
        style={{
          position: context.strategy,
          top: top ?? context.y ?? 0,
          left: left ?? context.x ?? 0,
          visibility: context.x == null ? "hidden" : "visible",
          ...props.style,
        }}
        {...context.getFloatingProps(props)}
      />
    </FloatingPortal>
  );
});

export default TooltipContent;
