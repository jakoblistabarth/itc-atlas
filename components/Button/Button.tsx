import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { Button as ButtonTUI } from "theme-ui";

type Props = React.PropsWithChildren & ComponentPropsWithoutRef<"button">;

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { children, ...rest },
  ref
) {
  return (
    <ButtonTUI ref={ref ?? undefined} {...rest}>
      {children}
    </ButtonTUI>
  );
});

export default Button;
