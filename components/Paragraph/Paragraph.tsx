import { FC, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLParagraphElement> & PropsWithChildren;

const Paragraph: FC<Props> = ({ children, className, ...props }) => (
  <p className={twMerge("mt-5 max-w-2xl text-justify", className)} {...props}>
    {children}
  </p>
);

export default Paragraph;
