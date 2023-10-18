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
      className="text-itc-green no-underline transition-colors hover:text-itc-blue dark:hover:text-itc-green-200"
    >
      {children}
    </NextLink>
  );
};

export default Link;
