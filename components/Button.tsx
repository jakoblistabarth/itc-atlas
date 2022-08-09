import React, { forwardRef } from "react";

type Props = React.PropsWithChildren<{
  outline?: Boolean;
}>;

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ outline, children }, ref) => {
    return <button ref={ref ?? undefined}>{children}</button>;
  }
);

export default Button;
