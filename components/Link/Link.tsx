import NextLink from "next/link";
import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  href: string;
  description?: string;
}>;

const Link: FC<Props> = ({ href, children }) => {
  return (
    <NextLink
      href={href}
      className="text-itc-green no-underline transition-colors duration-500 hover:text-itc-green-900 dark:text-itc-green-400 dark:hover:text-itc-green-100"
    >
      {children}
    </NextLink>
  );
};

export default Link;
