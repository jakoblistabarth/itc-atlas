import { forwardRef, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = PropsWithChildren;

const CanvasStage = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & Props
>(function CanvasStage({ children, className, ...props }, propRef) {
  return (
    <div
      ref={propRef}
      className={twMerge("rounded-md bg-white shadow-md", className)}
      {...props}
    >
      {children}
    </div>
  );
});

export default CanvasStage;
