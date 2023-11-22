import { FC, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLElement> & PropsWithChildren;

const Section: FC<Props> = ({ children, className, ...props }) => (
  <div className={twMerge("my-10", className)} {...props}>
    {children}
  </div>
);

export default Section;
