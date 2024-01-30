import { FC, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLElement> & PropsWithChildren;

const Container: FC<Props> = ({ children, className, ...props }) => (
  <div className={twMerge("container max-w-7xl", className)} {...props}>
    {children}
  </div>
);

export default Container;
