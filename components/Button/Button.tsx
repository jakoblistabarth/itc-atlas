import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = React.PropsWithChildren & ComponentPropsWithoutRef<"button">;

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, className, ...rest },
  ref,
) {
  return (
    <button
      className={twMerge(
        "rounded-sm bg-itc-green px-2 py-1 text-white",
        className,
      )}
      ref={ref ?? undefined}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
