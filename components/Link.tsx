/** @jsxImportSource theme-ui */

import NextLink from "next/link";
import { FC } from "react";
import { Link as ThemeuiLink } from "theme-ui";

type Props = React.PropsWithChildren<{
  href: string;
  description?: string;
}>;

const Link: FC<Props> = ({ href, children }) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <ThemeuiLink>{children}</ThemeuiLink>
    </NextLink>
  );
};

export default Link;
