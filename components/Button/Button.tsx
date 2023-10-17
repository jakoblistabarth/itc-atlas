import React, { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = React.PropsWithChildren & ComponentPropsWithoutRef<"button">;

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, ...rest },
  ref,
) {
  return (
    <button
      className="rounded-sm bg-itc-green px-2 py-1 text-white"
      ref={ref ?? undefined}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
