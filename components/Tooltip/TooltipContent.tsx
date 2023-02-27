import { useMergeRefs, FloatingPortal } from "@floating-ui/react";
import { forwardRef } from "react";
import { useTooltipContext } from "./Tooltip";

type Props = {
  raised?: boolean;
};

const TooltipContent = forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & Props
>(function TooltipContent({ raised = true, ...props }, propRef) {
  const context = useTooltipContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  return (
    <FloatingPortal>
      {context.open && (
        <div
          ref={ref}
          style={{
            position: context.strategy,
            top: context.y ?? 0,
            left: context.x ?? 0,
            visibility: context.x == null ? "hidden" : "visible",
            backgroundColor: "white",
            padding: 5,
            borderRadius: 2,
            fontSize: "x-small",
            boxShadow: raised ? "0 0 10px rgb(200, 200, 200)" : "",
            ...props.style,
          }}
          {...context.getFloatingProps(props)}
        />
      )}
    </FloatingPortal>
  );
});

export default TooltipContent;
