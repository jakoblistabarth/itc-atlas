import clsx from "clsx";
import { forwardRef, HTMLProps, PropsWithChildren } from "react";

type Props = PropsWithChildren<{ height?: number }>;

const CanvasStage = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & Props
>(function CanvasStage({ children, height }, propRef) {
  return (
    <div
      ref={propRef}
      style={{ height: height }}
      className={clsx("rounded-md bg-white shadow-md", !height && "h-[500px]")}
    >
      {children}
    </div>
  );
});

export default CanvasStage;
