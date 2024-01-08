import { FC, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLElement> & PropsWithChildren;

const Section: FC<Props> = ({ children, className, ...props }) => (
  <section className={twMerge("my-10", className)} {...props}>
    {children}
  </section>
);

export default Section;
