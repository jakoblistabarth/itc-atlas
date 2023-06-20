import React, { forwardRef } from "react";

type Props = React.PropsWithChildren;

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children },
  ref
) {
  return <button ref={ref ?? undefined}>{children}</button>;
});

export default Button;
